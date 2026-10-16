// This module exports a modulator for the radio state constituents.
// It runs async in the background 'til state.done signals completions.
// state.repeateRangeMS holds the range of reschedule times, ie
// the frequency of modulation.  Currently ranges are ~7-10sec.
function modulator(state)
{
  setTimeout(() =>
  {
    if (state.reverb)
    {
      state.reverbWet = Random.Walk(state.reverbWet, .1, [0, 1]);
      state.reverb.SetParam("Wet", state.reverbWet);
      state.reverb.SetParam("Dry", 1 - state.reverbWet);
    }
    if (state.morseInst)
    {
      let g = Random.InRange(...state.morseGainRange);
      state.morseInst.SetParam("Gain", g);
      
      let pan = Random.InRange(-1, 1);
      state.morseInst.SetParam("Pan", pan);
    }
    if (state.droneInst)
    {
      if (state.droneNotes.length > 2)
      {
        let old = Random.Draw(state.droneNotes);
        state.droneInst.NoteOff(old, 1);
      }
      let next;
      while (true) 
      {
        next = Math.floor(Random.InRange(40, 55));
        if (!state.droneNotes.includes(next))
          break;
      }
      state.droneNotes.push(next);
      state.droneInst.SetParam("Pan", Random.InRange(-1, 1));
      state.droneInst.NoteOn(next, Random.InRange(.2, .8));
      
    }
    if (!state.done)
      modulator(state);
  }, Math.floor(Random.InRange(...state.repeatRangeMS)));
}

exports.Modulator = modulator;