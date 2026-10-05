async function demo(fiberCtx)
{
  const help = `
Hz.GrainFilter brings the wild, unpredictable world of granular 
synthesis to input-stream processing. Chop incoming audio into 
clouds of tiny grains, then scatter, stretch, reverse, overlap, 
and rearrange them into everything from subtle texture and motion 
to full-on glitchy mayhem. With granular filtering, the familiar 
signal becomes raw material for creating sounds that are fragmented, 
fluid, rhythmic, and delightfully strange.

GrainFilter decomposes the input stream into tiny "grains". 
Each grain's duration is measured in seconds and controlled 
by Duration.Value.  You can randomize grain duration with 
Duration.Spread. 

Grains are are triggered at Trigger.Rate grains per second. 
More grains per second means more grain overlaps and this 
means more perceived volume.  Generally you'll want to move 
Duration and TriggerRate in opposite directions.  

You can can really wacky distortions by modifying the grain 
rate and warp parameters.

This demo randomly selects one of 4 internet radio stations
as the input stream. Restarting the demo often results in
a different station.  NB: webaudio URLs can suffer from 
connection issues, high latency, CDN hiccups or become invalid.`;

  let scene = await Ascene.BeginFiber(fiberCtx);
  let dac = await scene.NewAnode("Hz.DAC");
  dac.Show();

  let radio = await scene.NewAnode("Hz.WebAudioIn");
  radio.Show();

  let filter = await scene.NewAnode("Hz.GrainFilter");
  filter.Show();

  // let scope = await scene.NewAnode("Hz.SpectreScope");
  // scope.Show();

  scene.Chain(radio, filter, dac);

  const stations = [
    ["https://ice8.securenetsystems.net/KVSH1019", "Vashon Island, WA USA"],
    ["https://streamer.radio.co/s2b0b90cfe/listen", "Thurso, Scotland"],
    ["https://icast1.streamcom.net/TeUpoko", "Wellington, NZ"], 
    ["https://usa1.bntworxtv.com/listen/beshfm_81.8/radio.mp3", "Nasugbu, Philippines"],
  ];

  const [url, name] = Random.Choose(stations);
  await radio.LoadPreset({
    Station: name,
    URL: url,
    Gain: 1, // large to ensure compressor activates
  });

  let content = document.querySelector(".Content");
  content.insertAdjacentHTML("beforeend", `<pre style="padding:10px">${help}</pre>`);
}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;