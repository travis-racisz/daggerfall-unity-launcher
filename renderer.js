// const dialogConfig = {
//     title: 'Select a file',
//     buttonLabel: 'This one will do',
//     properties: ['openDirectory']
// };
let data;

// const github = require('octonode');
// const client = github.client();
document.getElementById('dirs').addEventListener('click', (e) => {
    e.preventDefault()
    window.postMessage({ 
            type: 'select-dirs'
        })
    })

    const directoryName = document.createElement("p")
    window.electron.getDirectory((event, dir) => { 
        console.log(dir)
        directoryName.innerHTML = dir
        window.electron.getRelease()
        .then(res => {
            console.log(res, 'res')
                window.electron.getRemoteFile(res.name, res.browser_download_url, dir)
            })
    })
    const body = document.querySelector('body')
    body.appendChild(directoryName)

// fileInput.getFile(async (event) => {
//         event.preventDefault()
//         window.electron.getFile()
//     })
// fileInput.addEventListener('click', async function(e) {
    
//     dialog.showOpenDialog({
//         properties: ['openDirectory']
//     }).then(result => {
//         if (result.canceled) {
//             console.log('User canceled the dialog')
//         } else {
//             console.log(result.filePaths)
//             const folder = result.filePaths[0]
//             console.log(result)
//         }
//     })
// })

// fileInput.multiple = false

// client.get('/users/travis-racisz', (err, status, body, headers) => {
//     console.log(body);
//     })







// getRelease()
//     .then(async res => { 
//       res.data.assets.forEach(asset => { 
//             getRemoteFile(asset.name, asset.browser_download_url)
//             })
//     })