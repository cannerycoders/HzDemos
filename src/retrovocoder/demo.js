async function demo(fiberCtx)
{
  const help = `
RetroVocoder brings the classic, robotic charm of golden-age sci-fi 
into modern audio processing. Shape your voice or instruments through 
vintage-styled formant filtering and synth modulation, transforming 
ordinary signals into soaring robotic anthems, mechanical whispers, 
and timeless retro-futuristic textures. With warm analog character 
and comic-book-inspired punch, the familiar signal becomes raw material 
for creating sounds that are metallic, expressive, larger-than-life, 
and delightfully otherworldly. Thus saith Gemini.`;

const {Ascene, MusicTheory, path} = globalThis;
let scene = await Ascene.BeginFiber(fiberCtx);
let dac = await scene.NewAnode("Hz.DAC");
dac.Show();

let inst = await scene.NewAnode("Hz.FM7", {
  acfg: {mode: "stereo"} // vs "mono"
});
inst.Show();

// Mono Samplo
let voice = await scene.NewAnode("Hz.Samplo", {
  acfg: {mode: "stereo"} // vs "mono"
});
let files = ["../snd/obama.wav"];
await voice.LoadPreset({
  instrument: {kit: "Workspace", inst: files}
});
voice.Show();

let vocoder = await scene.NewAnode("Hz.RetroVocoder", {
  preset: {
    Wet: .9,
    Dry: .1
  }
});
vocoder.Show();

let scope = await scene.NewAnode("Hz.Scope", {acfg:{mode:"stereo"}});
scope.Show();

scene.Connect(voice, vocoder, 0, 0);
scene.Connect(inst, vocoder, 0, 1);
scene.Chain(vocoder, scope, dac);

await scene.VisualizeGraph();

let content = document.querySelector(".Content");
content.insertAdjacentHTML("beforeend", 
  `<pre style="padding:10px">${help}</pre>`);

voice.NoteOn(0, 1); // start playing our voice recording

await scene.Wait(scene.Seconds(2));

for (let e of [
  ["C4", "11",  4], 
  ["D4", "7", 6],
  ["E4", "5", 4.5],
  ["F4", "7", 8],
  ["F3", "min7", 8.5],
  ["G3", "maj7", 8],
  ["A3", "11", 4],
  ["B3", "11", 4],
  ["C4", "11", 4],
  ["D4", "11", 6],
  ["E4", "11", 4],
  ["F4", "11", 4],
])
{
  const [tonic, chord, dur] = e;
  let notes = MusicTheory.GetChordtypeKeys(chord, tonic);
  inst.Chord(notes, .7, scene.Seconds(dur));
  
  await scene.Wait(scene.Seconds(dur));
}


}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;