async function demo(fiberCtx)
{
  const help = `
This demo of the Hz.FM8 plugin produces notes from randomly generated preset 
configurations.  Marvel at the range of cool sounds FM can genrate!
Attempt to pierce the mysteries of the modulation matrix!

Wikipedia tells us:

Frequency modulation synthesis (or FM synthesis) is a form of sound synthesis 
whereby the frequency of a waveform is changed by modulating its frequency 
with a modulating source known as an operator. The (instantaneous) frequency 
of an oscillator is altered in accordance with the amplitude of a modulating 
signal.

Developed in the 1960s by researchers at Stanford University, its spread 
from Stanford University computer-music research into studios, homes, 
arcades, and consumer devices has made FM synthesis one of the most 
widely heard forms of digital synthesis of the late-20th century.
`;
  let scene = await Ascene.BeginFiber(fiberCtx);
  let dac = scene.GetDAC();
  dac.Show();

  let inst = await scene.NewAnode("Hz.FM8");
  inst.Show();

  let rev = await scene.NewAnode("Hz.Freeverb");
  rev.Show();

  let scope;
  scope = await scene.NewAnode("Hz.Scope");
  scope.Show();
  scene.Chain(inst, scope, rev, dac);
  scene.VisualizeGraph("FM8");

  let content = document.querySelector(".Content");
  content.insertAdjacentHTML("beforeend", `<pre style="padding:10px">${help}</pre>`);

  while(true)
  {
    await inst.LoadPreset("shuffle")

    let legato = .5;
    let interval = scene.Seconds(.25);
    let start = scene.Now();

    let keys = MusicTheory.GetScaleKeys("C whole tone", 2, 4);
    for (let i = 0;i < 100;i++)
    {
      let key = Random.Choose(keys);
      let vel = Random.InRange(.3, 1);
      inst.Note({key, velocity:vel, dur:interval, when:start});
      start += interval * legato;
      await scene.Wait(interval*legato*.99);
      // yield;
    }
  }

}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;