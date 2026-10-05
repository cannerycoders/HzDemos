import { HzBridge } from "@hzbridge/hzbridge.js";
import { DemoScript } from "./demo.js";

export class App
{
  constructor()
  {
    window.App = this;

    this.isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
    document.body.classList.toggle("touch", this.isTouchDevice);
    if(this.isTouchDevice) return;

    this.headerTitle = document.body.querySelector(".Header .Title");
    this.headerTitle.innerHTML = `
    <img style="height:100px" src="./img/logo.png"><br>
    <span id="instruction"><i style="font-size:2em;color:red;">&darr;</i>
    To audition: press the pulsing ear.</span>`;

    this.instruction = this.headerTitle.querySelector("#instruction");

    document.body.classList.remove("loading");
    this.hzbridge = new HzBridge(document.getElementById("hzbridge"));

    this.soundActivated = false;
    this.hzbridge.On("HzSbActivate", (onoff) =>
    {
      if(this.soundActivated == false)
      {
        this.instruction.style.display = "none";
        this.hzbridge.EvalScript(DemoScript);
        this.soundActivated = true;
      }
    });
  }

  async FetchLocalFile(fileref, filetype="text")
  {
    try
    {
      const response = await fetch(fileref);
      if(!response.ok)
        throw new Error(`HTTP error: Status ${response.status}.`);
      let data;
      switch(filetype)
      {
      case "arraybuffer":
        data = await response.arrayBuffer();
        break;
      case "json":
        data = await response.json();
        break;
      default:
        data = await response.text();
        break;
      }
      return data;
    }
    catch(err)
    {
      throw new Error(`Failed to fetch file ${fileref}: ` + err);
    }
  }

}