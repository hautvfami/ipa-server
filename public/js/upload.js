function upload(file) {
    const data = new FormData()
    data.append('file', file)
    uploading = true
    IPA.fetch(IPA.getApiUrl('/api/upload'), {
        method: 'POST',
        body: data,
    }, progress => {
        updateAddProgress(progress.loaded / progress.total)
    }).then(json => {
        // e.target.value = ''
        uploading = false
        if (json.err) {
            alert(json.err)
            return
        }
        loadList()
    }).catch(err => {
        uploading = false
        updateAddProgress(0)
    })
}

let $dropzone = document.querySelector('.dropzone');
let input = document.querySelector('.file');

$dropzone.ondragover = function (e) {
    e.preventDefault();
    this.classList.add('dragover');
};
$dropzone.ondragleave = function (e) {
    e.preventDefault();
    this.classList.remove('dragover');
};
$dropzone.ondrop = function (e) {
    e.preventDefault();
    this.classList.remove('dragover');
    upload(e.dataTransfer.files[0]);
    console.log(input.files);
}

function updateAddProgress(progress) {
    const add = document.querySelector(".add-btn")
    if (progress === 0) {
        add.innerHTML = IPA.langString('Add')
    } else if (progress === 1) {
        add.innerHTML = IPA.langString('Upload Done!')
        setTimeout(() => {
            add.innerHTML = IPA.langString('Add')
        }, 2000)
    } else {
        add.innerHTML = `${(progress * 100).toFixed(2)}%`
    }
}

let uploading = false
window.onbeforeunload = () => uploading ? true : undefined
document.querySelector(".file").addEventListener("change", e => {
    if (e.target.files.length === 0) {
        return;
    }
    upload(e.target.files[0])
})
document.querySelector(".add-btn").addEventListener("click", e => {
    uploading || document.querySelector(".file").click()
})

// init lazy load
const instance = Layzr({
    threshold: 20
})

function loadList() {
    IPA.fetch(IPA.getApiUrl('/api/list')).then(list => {
        document.querySelector('#list').innerHTML = list.map(row => IPA.createItem(row)).join('')

        // start lazy load
        instance.update().check().handlers(true)
    })
}

window.addEventListener('load', loadList)
document.querySelector('.add-btn').innerHTML = IPA.langString('Add')