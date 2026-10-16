async function demo(fiberCtx)
{
const {Ascene} = globalThis;
let ascene = await Ascene.BeginFiber(fiberCtx); 
const help = `Sounds from the world.  It's complicated...`;

// console.log(`${id}: Warming up the radio tubes....`);

let state = {
  maxHeadlines: 5, // number determines duration
  maxStations: 10,
  doRecord: true,
  done: false,
  ascene,
  streamStates: [], // sparse array
  repeatRangeMS: [7000, 12000],
};

// debugger;
const {BuildRadioButtons, ToggleStation} = await fiberCtx.Require("./rtapp/gui.js");
const {Stations, ActivateStation} = await fiberCtx.Require("./rtapp/stations.js");
state.substations = Random.Shuffle(Stations).slice(0, state.maxStations);

BuildRadioButtons(state.substations, ActivateStation, state);

const {Morse, Feeds} = await fiberCtx.Require("./rtapp/morse.js");
const {Headlines} = await fiberCtx.Require("./rtapp/headlines.js");
const {Modulator} = await fiberCtx.Require("./rtapp/modulator.js");
const {Sweeper} = await fiberCtx.Require("./rtapp/sweeper.js");
const {CreateInstruments} = await fiberCtx.Require("./rtapp/instruments.js");

state.headlines =await Headlines(state.maxHeadlines); // <--- takes a few seconds

await CreateInstruments(state); // <-- takes a few seconds..

Modulator(state); // runs asynchronously, modulates parameters

// trigger (ON) GUI checkboxes for 4 favorite stations
ToggleStation(0);
ToggleStation(1);
ToggleStation(2);
ToggleStation(3);

let toMorse = new Morse(70, .1); // note, rate
for(let txt of state.headlines)
{
  for await (const value of Sweeper(state))
    ;
    
  for await (const value of toMorse.PerformText(ascene, state.morseInst, txt))
    ;
}
console.log("Enough with the noise, fade to darkness.");

state.done = true; // signal Modulator to stop modulating.

// trigger (OFF) GUI checkboxes for 4 favorite stations
let w = ascene.Seconds(.1);
for(let i=0;i<100;i++)
{
  state.dac.SetParam("Gain", state.dacGain * (1 - i/99));
  await ascene.Wait(w);
}

await ascene.Wait(ascene.Seconds(2));
await Aengine.Close();
console.log("radio: dark.")


}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  fn(this);
`;