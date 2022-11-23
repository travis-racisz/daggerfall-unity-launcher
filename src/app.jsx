import * as React from "react";
import * as ReactDOM from "react-dom";
import { downloadFile } from "./js/downloadFile";

const handleOnDownloadClicked = (e) => {
  e.preventDefault();
  downloadFile();
};

const handleOnLaunchClicked = (e) => {
  e.preventDefault();
  console.log("handleOnLaunchClicked");
};

const handleUpdateGameClicked = (e) => {
  e.preventDefault();
  console.log("handleUpdateGameClicked");
};

const handleCheckForUpdateClicked = (e) => {
  e.preventDefault();
  console.log("handleCheckForUpdateClicked");
};

function render() {
  ReactDOM.render(
    <body>
      <title>Daggerfall Launcher</title>
      <h1>Daggerfall Unity Installer and Updater</h1>
      <div class="desc-flex">
        <div class="small-col-flex">
          <div class="button-flex">
            <div id="download-container" class="download-container">
              <div id="currently-installed" class="currently-installed">
                <p id="current-release"></p>
                <div id="folder-tooltip" class="tooltip">
                  <span class="tooltiptext">Update game files directory</span>
                </div>
              </div>
            </div>
            <button onClick={handleOnDownloadClicked}>
              Download Daggerfall
            </button>
            <progress id="progress" class="hidden"></progress>
            <p id="download-message" class="hidden"></p>
          </div>
          <div id="launch-game-container" class="download-container">
            <button
              onClick={handleOnLaunchClicked}
              type="button"
              id="launch-game"
            >
              Launch Game
            </button>
          </div>
          <div id="update-container" class="update-container">
            <button
              onClick={handleUpdateGameClicked}
              type="button"
              id="update-game"
            >
              Update Game
            </button>
          </div>
          <button onClick={handleCheckForUpdateClicked} id="update">
            Check For Update
          </button>
        </div>
      </div>
    </body>,
    document.body
  );
}

render();
