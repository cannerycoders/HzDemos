async function demo(fiberCtx)
{
  const help = `
SpectreDelay conjures the haunted, ghostly echoes of magnetic tape 
and analog gear into your signal path. Wrap your audio in drifting, 
warbling repeats that fade into the ether, then manipulate time, 
feedback, and flutter to build everything from subtle spatial depth 
to sprawling, haunted soundscapes. With vintage cassette warmth 
and spectral haunting, the familiar signal becomes raw material 
for creating echoes that are spacey, atmospheric, rhythmically 
hypnotic, and wonderfully eerie. Thus saith Gemini.`;

  // Simple example of Hz.Spectre's 
  // Gain Envelope feature.  Note that if you view 
  // the envelope (spectre/envslide.knt)
  // during its performance, the z-slider and 
  // visualized/interpolated curve updates as well.
  // 
  const {Ascene, path} = globalThis;
  let scene = await Ascene.BeginFiber(fiberCtx);
  let dac = scene.GetDAC();
  dac.Show();

  let acfg = {mode: "mono"};
  let spectre = await scene.NewAnode("Hz.Spectre", {
    acfg,
    preset: {
      // GainEnv: path.join(this.GetCWD(), "spectre/envslide.knt"),
      DelayEnv: path.join(fiberCtx.GetCWD(), "envslide.knt"),
      ZScale: 10
    }
  });
  spectre.Show();

  // Mono Samplo
  let voice = await scene.NewAnode("Hz.Samplo", {acfg});
  let files = [path.join(fiberCtx.GetCWD(), "../snd/obama.wav")];
  await voice.LoadPreset({
    instrument: {kit: "Workspace", inst: files}
  });
  voice.Show();

  let sscope = await scene.NewAnode("Hz.SpectreScope", {name:"spectre"});
  sscope.Show();

  let sscope2 = await scene.NewAnode("Hz.SpectreScope", {name:"raw"});
  sscope2.Show();

  scene.Chain(voice, spectre, sscope, dac);
  scene.Chain(voice, sscope2, scene.GetBlackhole());
  scene.VisualizeGraph();
  voice.NoteOn(0, 1); // start playing our voice recording

  let content = document.querySelector(".Content");
  content.insertAdjacentHTML("beforeend", `<pre style="padding:10px">${help}</pre>`);
}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;