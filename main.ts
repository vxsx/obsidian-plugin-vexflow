import {
  App,
  MarkdownPostProcessor,
  MarkdownPostProcessorContext,
  MarkdownPreviewRenderer,
  MarkdownRenderer,
  Modal,
  Notice,
  Plugin,
  PluginSettingTab,
  Setting,
} from "obsidian";
import vextab from "vextab/releases/vextab-div";

const { VexTab, Artist, Flow } = vextab;

const Renderer = Flow.Renderer;
Artist.NOLOGO = true;

export default class MusicPlugin extends Plugin {
  static postprocessor: MarkdownPostProcessor = (
    el: HTMLElement,
    ctx: MarkdownPostProcessorContext
  ) => {
    // Assumption: One section always contains only the code block

    const blockToReplace = el.querySelector("pre");
    if (!blockToReplace) {
      return;
    }

    const musicBlock = blockToReplace.querySelector(
      "code.language-music-vextab"
    );
    if (!musicBlock) {
      return;
    }

    const source = musicBlock.textContent;
    const destination = document.createElement("div");
    document.body.appendChild(destination);
    destination.style.background = "white";

    setTimeout(() => {
      const renderer = new Renderer(destination, Renderer.Backends.SVG);
      // Initialize VexTab artist and parser.
      const artist = new Artist(10, 0, 860, {
        scale: 1,
        bottom_spacing: 50,
        tab_stave_lower_spacing: 20,
        note_stave_lower_spacing: 20,
      });
      const tab = new VexTab(artist);
      tab.parse(source);
      artist.render(renderer);

      el.replaceChild(destination, blockToReplace);
    });
  };

  onload() {
    console.log("loading vextab plugin");
    MarkdownPreviewRenderer.registerPostProcessor(MusicPlugin.postprocessor);
  }

  onunload() {
    console.log("unloading vextab plugin");
    MarkdownPreviewRenderer.unregisterPostProcessor(MusicPlugin.postprocessor);
  }
}
