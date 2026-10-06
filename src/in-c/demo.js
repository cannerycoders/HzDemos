async function demo(fiberCtx)
{
  const inc_hz = `
// Terry Riley's 'In C'.
// https://thirdcoastpercussion.com//downloads/2015/04/Terry-Riley-In-C-concert2.pdf

Song(Id:"In C")
{
  Tempo = 180
  Meter = [1, 4]
  // SPM = 1/4 // means that one measure is one second (Overrides Tempo)
  // SPM = 1 // means that one quarter is one second
  // Dur = 1 to debug note durs
        
  // define short-names covering two octavies for our 54 phrases...
  Transpose = 60
  c = 0
  d = 2
  e = 4
  f = 5
  f# = 6
  g = 7
  a = 9
  bb = 10
  b = 11
  gl = -5
  ch = 12
  dh = 14
  eh = 16
  fh = 17
  f#h = 18
  gh = 19
  ah = 21
  bh = 23
  
  // here we treat each part as a single "measure"
  // we stretch it to the number of quarter notes it takes
  // to represent it.  So an unstretched measure == 1 quarter note.
    
  v0 = <z>*RandRange(2,16)
  v1 = <<c e@7>*3>@3*RandRange(5,10)
  v2 = <<<c e@3> f> e>@2*RandRange(5,10)
  v3 = <z e f e>@2*RandRange(5,10)
  v4 = <z e f g>@2*RandRange(5,10)
  v5 = <e f g z>@2*RandRange(5,10)
  v6 = <ch>@8*RandRange(2,4)
  v7 = <z z z <z <c c>> <c z> z z z z>@9*RandRange(1,4)
  v8 = <g@6 f@8>@14*RandRange(1,3)
  v9 = <<<b g> z> z z z>@4*RandRange(3,8)
  v10 = <b g>@1/2*RandRange(1,10)
  v11 = <f g b g b g>@3/2*RandRange(1,10)
  v12 = <<f g> b@4 ch>@6*RandRange(1,6)
  v13 = <b g@3 g f g@2 z@3 g@13>@12*RandRange(1,2)
  v14 = <ch b g f#>@16*RandRange(1,2)
  v15 = <<g z*3> z*3>@4*RandRange(3,6)
  v16 = <g b ch b>@1*RandRange(4,12)
  v17 = <b ch b ch b z>@3/2*RandRange(4,15)
  v18 = <e f# e f# e@3 e>@2*RandRange(2,6)
  v19 = <z gh>@3*RandRange(1,5)
  v20 = <e f# e f# gl@3 e f# e f# e>@3*RandRange(2,5)
  v21 = <f#>@3*RandRange(3,8)
  v22 = <e@3 e@3 e@3 e@3 e@3 f#@3 g@3 a@3 b>@25/2*RandRange(2,5)
  v23 = <e f#@3*5 g@3 a@3 b@2>@12*RandRange(1,3)
  v24 = <e f# g@3*5 a@3 b>@21/2*RandRange(1,4)
  v25 = <e f# g a@3*5 b@3>@21/2*RandRange(1,4)
  v26 = <e f#@3*5 g@3 a@3 b@2>@12*RandRange(1,3)
  v27 = <<e f#>*2 g <e g> <f e>*2>@3*RandRange(1,5)
  v28 = <<e f#>*2 e@3/2 e@1/2>@2*RandRange(2,6)
  v29 = <e g ch>@9*RandRange(1,3)
  v30 = <ch>@6*RandRange(1,3)
  v31 = <g f g b g b>@3/2*RandRange(4,9)
  v32 = <f g f g b f@25 g@6>@9*RandRange(1,3)
  v33 = <g f z@2>@1*RandRange(1,5)
  v34 = <g f>@1/2*RandRange(4,10)
  v35 = <<f g b g  b g b g  b g z@2>@3
          z@3 bb gh@3 ah@1/2 gh bh@1/2 ah@3/2
          gh@1/2 eh@3 gh@1/2 f#h@7/2 z*2 
          z@1/2 eh@5/2 fh@6>@32*RandRange(1,3)
  v36 = <f g b g b g>@3/2*RandRange(4,8)
  v37 = <f g>@1/2*RandRange(1,10)
  v38 = <f g b>@3/4*RandRange(1,10)
  v39 = <b g f g b ch>@3/2*RandRange(1,10)
  v40 = <b f>@1/2*RandRange(3,10)
  v41 = <b g>@1/2*RandRange(3,10)
  v42 = <ch b a ch>@16*RandRange(1,3)
  v43 = <<fh eh fh eh> <eh eh> <eh <fh eh>>>@3*RandRange(3,7)
  v44 = <fh eh@2 eh ch@2>@3*RandRange(3,7)
  v45 = <dh dh g>@3*RandRange(3,7)
  v46 = <<g dh eh dh> <z g> <z g> <z g> <g dh eh dh>>@5*RandRange(3,7)
  v47 = <<dh eh> dh>@1*RandRange(3,9)
  v48 = <g@6 g@4 f@5>@15*RandRange(1,3)
  v49 = <f g bb g bb g>@3/2*RandRange(5,9)
  v50 = <f g>@1/2*RandRange(5,9)
  v51 = <f g bb>@3/4*RandRange(5,9)
  v52 = <g bb>@1/2*RandRange(5,9)
  v53 = <bb g>@1/2*RandRange(5,9)
    
  Voice(Id:"fx1") 
  { 
    // voices with special '_globalEffect' preset are placed in front of
    // DAC in the voice/song order. You can achieve even more control
    // over global effect via a custom InitVoice script.
    AnodeInit = ["Hz.ConvVerb", "_globalEffect", (Wet:.4,Dry:.6)]
  }
  Voice(Id:"v1") 
  { 
    AnodeInit = ["GeneralMIDI", "piano1"]
    Pan = 0
    DisplayColor = "darkgreen"
  }
  Voice(Id:"v2") 
  { 
    AnodeInit = ["GeneralMIDI", "tuba"]
    Pan = .25
    DisplayColor = "brown"
    DisplayOffset = 4
    Transpose += -12
  }
  Voice(Id:"v3") 
  { 
    AnodeInit = ["GeneralMIDI", "pizzicato_strings"]
    Pan = .5
    DisplayColor = "purple"
    DisplayOffset = 8
  }
  Voice(Id:"v4") 
  { 
    AnodeInit = ["GeneralMIDI", "vibraphone"]
    Pan = .75
    DisplayColor = "orange"
    DisplayOffset = 16
  }
  Voice(Id:"v5") 
  { 
    AnodeInit = ["GeneralMIDI", "electric_bass_pick"]
    Pan = 1 
    DisplayColor = "cyan"
    DisplayOffset = 22
  }
  Voice(Id:"v6") 
  { 
    AnodeInit = ["GeneralMIDI", "cello"]
    Pan = 0
    Volume = 1
    DisplayColor = "#ac0"
    DisplayOffset = 16 // 28 - 12
    Transpose += -12
  }
    
  Track(Id:"Track1", Mute:0)
  {
    VoiceRef = "v1"
    // no $<v0> which is just random rest, so we're first.
    $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  Track(Id:"Track2", Mute:0)
  {
    VoiceRef = "v2"
    $<v0> $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  Track(Id:"Track3", Mute:0)
  {
    VoiceRef = "v3"
    $<v0> $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  Track(Id:"Track4", Mute:0)
  {
    VoiceRef = "v4"
    $<v0> $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  Track(Id:"Track5", Mute:0)
  {
    VoiceRef = "v5"
    $<v0> $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  Track(Id:"Track6", Mute:0)
  {
    VoiceRef = "v6"
    $<v0> $<v1> $<v2> $<v3> $<v4>
    $<v5> $<v6> $<v7> $<v8> $<v9>
    $<v10> $<v11> $<v12> $<v13> $<v14>
    $<v15> $<v16> $<v17> $<v18> $<v19>
    $<v20> $<v21> $<v22> $<v23> $<v24>
    $<v25> $<v26> $<v27> $<v28> $<v29>
    $<v30> $<v31> $<v32> $<v33> $<v34>
    $<v35> $<v36> $<v37> $<v38> $<v39>
    $<v40> $<v41> $<v42> $<v43> $<v44>
    $<v45> $<v46> $<v47> $<v48> $<v49>
    $<v50> $<v51> $<v52> $<v53>
  }
    
  // debugging track
  Track(Id:"testUnits", Mute:1)
  {
    Transpose = 0
    nW = 121
    nH = 121
    nQ = 121
    nE = 121
    nS = 121

    W = <nW>@4
    H = <nH nH>@4
    Q = <nQ nQ nQ nQ>@4 // quarter notes
    E = <nE nE nE nE>@2*2 // eighth notes
    S = <nS nS nS nS>*4 // sixteenth notes
    Z = <z>@4
        
    SPM = 1/4 // means that one measure is one second
    // $<W> $<Z> $<H> $<Z> $<Q> $<Z> $<E> $<Z> $<S>
  }
    
}`;

  const help = `
<p>
This is a demonstration of Hz's support for songbook.hz notation. The actual
notation isn't presented here, nor is Hz's live-performance visualization.
If these topics are of interest, there's no substitute for running the demo
directly in <a target="_blank" href="https://cannerycoders.com/apps/HzWeb">Hz</a>.  
There you can inspect and modify the song, author voices and tracks,
manipulate timing, etc.
</p> <p>
The 'song' is a transcription of the seminal minimalist composition by 
Terry Riley.  In this demo you can tweak the individual voices and effects.  
</p> <p>
From Wikipedia: In C is a composition by Terry Riley from 1964. It is one of the 
most successful works by an American composer and a seminal example of 
minimalism. The score directs any number of musicians to repeat a series 
of 53 melodic fragments in a guided improvisation.
</p> <p>
Terry Riley's 1968 recording of In C, released on Columbia Records, was 
added to the National Recording Registry of the United States Library of 
Congress in 2022. The piece has inspired many minimalist and postminimalist 
composers, including Philip Glass and Steve Reich as well as pop and rock 
musicians.`;
  const attrib = `<i style='font-size:.8em'>logo snipped from photo of a
Riley sketch taken by Michael Bednarek - own work, CC0, 
https://commons.wikimedia.org/w/index.php?curid=194126225.</i>`;
  let str = inc_hz;
  let songbook = new Songbook(str, "In C.hz"); 
  let content;
  for await (const val of songbook.PerformSong(fiberCtx))
  {
    if(content == null)
    {
      content = document.querySelector(".Content");
      content.insertAdjacentHTML("beforeend", `
        <div style="padding:10px;width:30em">
          <div>${help}</div>
          <br>
          ${attrib}
        </div>`);
    }
  }
}

let src = demo.toString();

export const DemoScript = `
  let fn = (${src});
  await fn(this);
`;