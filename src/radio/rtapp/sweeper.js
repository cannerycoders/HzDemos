// change the channel - bank of noise
async function *sweepChannels(state)
{
  let noiseDur = state.ascene.Seconds(.5);

  async function doNoise(tscale = 1)
  {
    await state.ascene.Sync();
    state.noiseInst.NoteOn(30, .8);
    await state.ascene.Wait(noiseDur * tscale);
    state.noiseInst.NoteOff(30);
  }
    
  await doNoise();
  yield;
    
  for (let i = 0;i < 10;i++)
  {
    // tunerInst.SetParam("/mix1/Gain", -10);
    // tunerInst.SetParam("/voice/GlidePeriod", .05 * Math.random());
    // tunerInst.SetParam("/osc1/Waveform", Math.floor(4 * Math.random()));
    // yield;
        
    let key = Math.floor(30 + 60 * Math.random());
    state.tunerInst.NoteOn(key, .8);
    await state.ascene.Wait(state.ascene.Seconds(.05 + .2 * Math.random()));
    state.tunerInst.NoteOff(key);
    yield;
        
    if (i % 3 == 0)
      await doNoise(.5);
  }
    
  await doNoise();
}

exports.Sweeper = sweepChannels;