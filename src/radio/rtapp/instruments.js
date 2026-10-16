async function createInstruments(state)
{
  const ascene = state.ascene;

  // DAC -------------------------------------------
  state.dac = ascene.GetDAC();
  state.dacGain = 1.;
  state.dac.SetParam("Gain", state.dacGain);
  state.dac.Show();

  // Reverb ----------------------------------------
  state.reverbWet = .5;
  state.reverb = await ascene.NewAnode("Hz.ConvVerb", {
    name:"reverb",
    preset:{
      Wet:state.reverbWet, 
      Dry:1 - state.reverbWet
    }});
  state.reverb.Show();

  // Morse player -----------------------------------
  state.morseInst = await ascene.NewAnode("Hz.Osc", {
    name:"morse", 
    preset:{
      Waveform:1, A:.01, R:.01, S:1, 
      Pan:0, Gain:.06, Unison:4, 
      Detune:2, Spread:.5
    }});
  state.morseGainRange = [.01, .06];
  state.morseInst.Show();
  ascene.Chain(state.morseInst, state.reverb, state.dac);

  // Drone -----------------------------------------
  state.droneInst = await ascene.NewAnode("Hz.FM7", {
    name:"drone", 
    preset:{Gain:4, Bank:33, Patch:3}
  }); // insmouth
  ascene.Chain(state.droneInst, state.reverb);
  state.droneNotes = [];
  state.droneInst.Show();

  // Noise ----------------------------------------
  state.noiseInst = await ascene.NewAnode("Hz.Noise", {
    name:"noise",
    preset: {Gain:.7, A: .25, R: .25, S: 1,}
  });
  ascene.Chain(state.noiseInst, state.reverb);
  state.noiseInst.Show();

  // Tuner ----------------------------------------
  state.tunerInst = await ascene.NewAnode("Hz.Osc", {
    name:"tuner",
    preset: {Gain:.5, Pan: 1,}
  });
  state.tunerInst.Show();
  ascene.Chain(state.tunerInst, state.reverb);
}

exports.CreateInstruments = createInstruments;