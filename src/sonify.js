// nb: within QuakeSonify, "this" refers to the function object
// and not the fiber context object.
async function *QuakeSonify(sbctx)
{
  /* ------------------------------------------------------ */
  // this class is used to serialize incoming IPC requests.
  class AsyncCommandQueue
  {
    constructor()
    {
      this.queue = [];
      this.running = false;
    }
    enqueue(command)
    {
      this.queue.push(command);
      this.drain();
    }
    async drain()
    {
      if (this.running) return;
      this.running = true;
      try
      {
        while (this.queue.length > 0)
        {
          const command = this.queue.shift();
          await command();
        }
      }
      finally
      {
        this.running = false;
      }
    }
  }
  /* --------------------------------------------------------------- */

  async function getAlert()
  {
    let alert = await Anode.New("Hz.Samplo", {
      preset: {
        A: 0.1,
        D: 0.01,
        S: 1,
        R: 3, 
        Gain: 2,
        instrument: {
          kit: "Workspace", 
          inst: ["./snd/bell.mp3"]
        },
      }
    });
    alert.play = function(maxmag)
    {
      // let nnotes = Math.round(maxMag); 
      // const interval = scene.Seconds(5) / nnotes;
      const vel = Math.min(maxmag/6, 1);
      const dur = scene.Seconds(2 * maxmag);
      alert.Note(0, vel, dur, 0);
      // await scene.Wait(interval*1.05);
    }
    return alert;
  }

  /* --------------------------------------------------------------- */
  const doOsc = true;
  const doNoise = true;
  const doAlert = true;

  const showOsc = true;
  const showNoiseMix = true;
  const showNoiseVoice = false;

  const showAlert = false;
  const showGraph = false;
  const quakeVerbose = false;

  // console.log("Running QuakeSonify");

  let scene = await Ascene.BeginFiber(sbctx, {
    AEngine: {
      verbosity: 1, 
      latencyHint:"playback"
    }});
  let lastUnderruns = 0;

  // the "click" is apparently produced by underrun events.
  // this is ameliorated by the latencyHint: "playback"
  function checkStats(stats)
  {
    setTimeout(() =>
    {
      if(stats.underrunEvents != lastUnderruns)
      {
        lastUnderruns = stats.underrunEvents;
        console.log(JSON.stringify(stats, null, 2));
      }
      checkStats(stats);
    }, 5000);
  }

  if(Aengine.audioContext.playbackStats)
    checkStats(Aengine.audioContext.playbackStats);
  else
    console.log("browser doesn't support playbackStats");

  let dac = scene.GetDAC();
  await dac.LoadPreset({
    Gain: .6
  });
  dac.Show();

  let out = dac;

  let sscope = await Anode.New("Hz.SpectreScope", {name:"QuakeScope"});
  scene.Chain(sscope, dac);
  sscope.Show();

  let compress = await Anode.New("Hz.DynaCompress", {
    name:"Compressor",
    preset: {
      Threshold: -1,
      Knee: 3,
    }
  });
  scene.Chain(compress, sscope);
  compress.Show();
  out = compress;

  let osc;
  if(!doOsc)
    osc = null;
  else
  {
    osc = await Anode.New("Hz.Osc", {
      preset: {
        Waveform: 0, // sine
        Gain: 1,
        A: 5,
        D: .01,
        S: 1,
        R: 5,
        Unison: 3, // was 3
        Spread: 1,
        Detune: .3
      }
    });
    let oscmix = await Anode.New("Hz.Mix", {
      name: "Tone",
      preset: {
        Gain: .14 
      }
    });
    
    if(showOsc)
    {
      oscmix.Show();
      // osc.Show();
    }

    scene.Chain(osc, oscmix, out);

    if(showGraph)
      scene.VisualizeGraph();
  }

  let noisemix;
  if(doNoise)
  {
    noisemix = await Anode.New("Hz.Mix", {
      name: "Rumble",
      preset: {
        Gain: 2.5
      }
    });
    if(showNoiseMix)
      noisemix.Show();
    scene.Chain(noisemix, out);
  }
  else
    noisemix = null;

  if(doAlert)
  {
    alert = await getAlert();
    if(showAlert)
      alert.Show();
    scene.Chain(alert, out);
  }

  const quakeCtx = 
  {
    activeQuakes: [],
    inactiveQuakes: [],
    osc,
  };

  function assignNoteAttributes(q)
  {
    q.note = 14 + globalThis.Random.Choose([20, 22, 24, 26, 28, 32, 36, 40, 44])
    q.velocity = 1; 
  }


  async function quakeOn(qevent)
  {
    if(quakeVerbose)
      console.log("quakeOn");
    let q;
    if(quakeCtx.inactiveQuakes.length == 0)
    {
      let noise, f1, f2, f3, mix;
      if(doNoise)
      {
        noise = await Anode.New("Hz.Noise", {
          acfg: {mode: "mono"},
          preset: {
            Waveform: 2, // brown
            Gain: 0.1, // three routes to dac
            A: 3,
            D: .01,
            S: 1,
            R: 5,
          }
        });

        const LFO = 1; // 
        f1 = await scene.NewAnode("Hz.Filter", {
          preset: {
            Type: 2, // bandpass
            Frequency: 50,
            Resonance: .8,
            Mix: 1,
            LFO,
            LFORate: .1,
            LFORange: 10,
          }});
        f2 = await scene.NewAnode("Hz.Filter", {
          preset: {
            Type: 2, // bandpass
            Frequency: 90,
            Resonance: .8,
            Mix: 1,
            LFO,
            LFORate: .2,
            LFORange: 5,
          }});
        f3 = await scene.NewAnode("Hz.Filter", {
          preset: {
            Type: 0, // lowpass
            Frequency: 200,
            Resonance: 0.5, 
            Mix: 1,
            LFO,
            LFORate: .12,
            LFORange: 5,
          }});
        mix = await scene.NewAnode("Hz.Mix", {
          acfg: {mode: "1to2"},
          preset: {
            Pan: .5, 
            Gain: 1, // modified below
          }});
        if(showNoiseVoice)
          mix.Show();
        scene.Chain(noise, f1, mix);
        scene.Chain(noise, f2, mix);
        scene.Chain(noise, f3, mix);
        scene.Chain(mix, noisemix);
        if(showGraph)
        {
          if(quakeCtx.showTimeout == null)
            clearTimeout(quakeCtx.showTimeout);
          quakeCtx.showTimeout = setTimeout(() =>
          {
            scene.VisualizeGraph("Quake");
            quakeCtx.showTimeout = null;
          });
        }
      }
      q = {
        noise,
        f1,
        f2,
        f3,
        mix,
      };
    }
    else
      q = quakeCtx.inactiveQuakes.pop();

    q.qevent = qevent; // quake.event
    if(quakeVerbose)
      console.log(`${qevent.id}: NoteOn`)
    quakeCtx.activeQuakes.push(q);

    assignNoteAttributes(q);
    let qgain = .5 + 3 * qevent.properties.mag/7;
    let pan = 2*Math.random() - 1; // mix's pan is -1,1
    if(q.noise)
    {
      q.mix.SetParam("Pan", pan), // mix's pan is -1,1
      q.mix.SetParam("Gain", qgain);
      q.noise.NoteOn(30, 1); // noise: note is ignored
    }
    if(quakeCtx.osc)
    {
      quakeCtx.osc.SetParam("Pan", pan); // osc pan is -1,1 
      q.noteId = quakeCtx.osc.NoteOn(q.note, q.velocity)[0];
      // XXX: apply per-note expression for pan.
    }
  }

  function quakeOff(qevent)
  {
    quakeCtx.activeQuakes = quakeCtx.activeQuakes.filter((q) =>
    {
      if(q.qevent.id == qevent.id)
      {
        if(q.noise)
        {
          if(quakeVerbose)
            console.log(`${qevent.id} NoteOff`);
          q.noise.NoteOff(30, 1);
        }
        if(quakeCtx.osc)
        {
          quakeCtx.osc.NoteOff(q.note, 1, 0, q.noteId);
        }
        quakeCtx.inactiveQuakes.push(q);
        return false;
      }
      else
        return true;
    });
  }

  let cmdQueue = new AsyncCommandQueue();
  SandboxCtx.IPC.On("QuakeMsg", (msg) =>
  {
    // console.log("QuakeMsg: " + JSON.stringify(msg));
    switch(msg.type)
    {
    case "QuakeOn":
      cmdQueue.enqueue(async () =>
      {
        await quakeOn(msg.quake);
      });
      break;
    case "QuakeOff":
      quakeOff(msg.quake);
      break;
    case "Alert":
      if(alert)
        alert.play(msg.maxmag);
      break;
    case "onCameraMove":
      break;
    case "idle":
      break;
    }
  });

  SandboxCtx.IPC.Notify("QuakeSonifyReady", {ready: true});

  while(true)
  {
    let msg = yield; // allows for external cancellation
    if(msg == "_cancel_") break;
    await scene.Wait(scene.Seconds(10));
    // console.log("sonify tick...");
  }
}

const src = QuakeSonify.toString();

// we take this approach in order to get full IDE feedback
// on the function above.  Alternative is to return it as a 
// raw code-block.
export const RunQuakeSonify = `
  let fn = (${src});

  for await (const val of fn(this))
    yield;
`