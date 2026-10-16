// internet stations come and go, YMMV.
exports.Stations = [
  ["https://live.radioradicale.it/live.mp3", "Radio Radicale, Italy"],
  ["https://trans.echoperm.ru:8000/stream", "Perm Russia"],
  ["https://ice23.securenetsystems.net/KEND", "KEND, Roswell NM"],
  ["http://live02.rfi.fr/rfimonde-64.mp3", "News of France"],
  ["https://servidor29-4.brlogic.com:8362/live", "Salvador, Brazil"],
  ["https://servidor19-4.brlogic.com:7304/live", "Radio Sangeet Masti, Fiji"],
  ["https://n03.rcs.revma.com/pntx1639ntzuv.m4a", "Taipei, Taiwan"],
  ["https://stream.radiosaw.de/saw/mp3-192/radiosaw-de/stream.mp3", "Magdeburg, Germany"],
  ["https://cast6.asurahosting.com/proxy/irfradio/stream", "La Paz, Bolivia"],
  ["https://n01.radiojar.com/66zgtscuc1duv?rj-ttl=5&rj-tok=AAABnxTaNuEAsUenB7WDgq5nQw", "Tokyo, Japan"],
  ["https://daralhdeth.com/radio.mp3", "Ad Dali, Yemen"],
  ["https://sa.mp3.icecast.magma.edge-access.net/sc_rad38", "Radio Argentina"],
  ["https://streaming01.shockmedia.com.ar/8340/stream", "Gualeguay, Argentina"],
  ["http://103.7.56.219:4106", "WatNaiRong, Thailand"],
  ["https://icecast.teveo.cu/CL7jRXqn", "Cuidad Del Mar, Cuba"],
  ["https://stream.radio.co/s865966bbf/listen", "Kingston, Jamaica"],
  ["https://daralhdeth.com/radio.mp3", "Dar Al Hadith, Saudia Arabia"],
  ["https://cast4.my-control-panel.com/proxy/vaanmalar2/stream", "Chenai, India"],
  ["https://lhttp.qingting.fm/live/1221/64k.mp3", "ZhengZhou, China"],
  ["https://listen7.myradio24.com/69366", "Pyongyang, North Korea"],
  ["https://stream4.srr.ro:8443/antena-sibiului", "Sibiu, Romania"],
  ["http://89.238.227.6:8072/%7CRadio", "News of Romania"],
  ["https://radio.kahoku.net:8443/;", "Kahoku, Japan"],
  ["https://pakeefm.org/stream/701101/;stream.mp3", "Ratchaburi, Thailand"],
  ["https://ice8.securenetsystems.net/KVSH1019", "Vashon Island, WA USA"],
  ["https://streamer.radio.co/s2b0b90cfe/listen", "Thurso, Scotland"],
  ["https://icast1.streamcom.net/TeUpoko", "Wellington, NZ"], 
  ["https://usa1.bntworxtv.com/listen/beshfm_81.8/radio.mp3", "Nasugbu, Philippines"],
  ["https://stream.deevaradio.net:10443/paradisagasy", "ParadisAgasy, Madagascar"],
  ["https://pulsarouagadougou.ice.infomaniak.ch/pulsarouagadougou-64.mp3?1739488772", "Burkina Faso"],
  ["https://a1.asurahosting.com/listen/hope_radio_/radio.mp3", "Khartoum, Sudan"],
  ["https://halo.streamerr.co/listen/radio_boresha/radio.mp3", "Dar es Salaam, Tanzania"],
  ["https://audio-edge-fvq45.ams.d.radiomast.io/55362b64-fae9-4901-af1f-2a5912e27073", "Voi, Kenya"],
  ["https://servidor36.brlogic.com:7014/live", "Assomada, Cape Verde"],
  ["https://radioaintimouchent.ice.infomaniak.ch/aintimouchent.mp3", "Ain Temouchent, Algeria"],
  ["https://ice-11.spilarinn.is/xruv2", "Rejkjavic, Iceland"],
  ["https://cdn0-47115-liveicecast0.dna.contentdelivery.net/sapmi_mp3_h", "Karasjok, Norway"],
];

async function activateStation(stationIndex, checked, state)
{
  state.debounce = null;
  let [url, name] = state.substations[stationIndex];
  if (checked)
  {
    let ss = state.streamStates[stationIndex];
    if (ss == null)
    {
      ss = {};
      state.streamStates[stationIndex] = ss;
      ss.anode = await state.ascene.NewAnode("Hz.WebAudioIn", {
                    name,
                    preset: {
                      Station: name,
                      URL: url,
                      Gain: Random.InRange(.2, .4)
                    }});
      state.ascene.Connect(ss.anode, state.reverb);
      if (state.debounce == null)
      {
        state.debounce = setTimeout(() =>
        {
          state.ascene.VisualizeGraph("Radio");
          state.debounce = null;
        }, 500);
      }
    }
    else
    {
      ss.anode.SetParam("Gain", Random.InRange(.2, .4));
    }
    ss.anode.Show();
  }
  else
  {
    let ss = state.streamStates[stationIndex];
    if (ss && ss.anode != null)
    {
      ss.anode.SetParam("Gain", 0); // Mute, could disconnect for efficiency
    }
  }
}

exports.ActivateStation = activateStation;