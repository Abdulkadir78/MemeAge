let mainContainer = document.querySelector(".main");
let display = document.querySelector(".display-section");
document.addEventListener("DOMContentLoaded", getTemplates);

// load templates from the api
function getTemplates() {
  fetch("https://api.imgflip.com/get_memes")
    .then((response) => response.json())
    .then((data) => displayTemplates(data.data.memes))
    .catch((error) => {
      displayError();
      console.log(error);
    });
}

function displayError() {
  let div = document.createElement("div");
  div.className = "text-center text-white h4 bg-danger mb-3";
  div.appendChild(
    document.createTextNode("An error occured, please try again later.")
  );
  document.body.insertBefore(div, mainContainer);

  setTimeout(() => document.body.removeChild(div), 2000);
}

// display templates in UI
function displayTemplates(memes) {
  let output = "";

  memes.forEach((meme) => {
    output += `
      <img src="${meme.url}" class="img-thumbnail image" onclick="caption('${meme.url}', '${meme.id}', '${meme.box_count}')">`;
  });
  display.innerHTML = output;
}

// add text to the template
function caption(url, id, box_count) {
  let input = "";
  for (let i = 1; i <= box_count; i++) {
    input += `<input type = "text" class="form-control mt-3" id="box${i}" placeholder = "Box-${i}..." >`;
  }

  // display the template and form entries
  mainContainer.innerHTML = `
          <div class="card col-md-6 mx-auto my-5">
              <img src="${url}" class="card-img-top mt-2">
              <div class="card-body">
                <form id="save-form">
                ${input}
                  <input type="submit" value="Create Meme" class="btn btn-outline-primary form-control mt-3 saveBtn">
                </form>
              </div>
          </div>
          <div class="col-md-9 ml-auto mb-4">
            <a href="index.html">Go back</a>
          </div>
      `;
  let form = document.getElementById("save-form");

  // create the meme on submit
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    let textInputs = []; // to store values of all inputs
    for (let i = 1; i <= box_count; i++) {
      let temp = document.getElementById(`box${i}`);
      textInputs.push(temp.value);
    }

    // the api throws an error if box-1 and box-2 are left empty
    if (textInputs[0] == "" && textInputs[1] == "") {
      textInputs[0] = " "; // fill box-1 with an empty space to escape the error
    }
    createMeme(id, textInputs);
  });
}

// create and display the meme
function createMeme(id, inputs) {
  // create the boxes parameter for posting
  let boxes = "";
  for (let i = 0; i < inputs.length; i++) {
    boxes += `&boxes[${i}][text]=${inputs[i]}`;
  }

  // all the required url parameters
  const urlParams = `template_id=${id}&username=imgflip_username&password=imgflip_pass${boxes}`;

  // post the meme
  fetch(`https://api.imgflip.com/caption_image?${urlParams}`)
    .then((response) => response.json())
    .then((data) => {
      // display meme
      mainContainer.innerHTML = `
        <div class="col-md-6 mx-auto mt-5">
          <img src="${data.data.url}" class="img-thumbnail">
        </div>
        <div class="col-md-9 ml-auto my-5">
            <a href="index.html">Go back</a>            
        </div>
        `;
    })
    .catch((error) => {
      displayError();
      console.log(error);
    });
}
