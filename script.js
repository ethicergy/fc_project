let items = [];
const parent = document.querySelector(".parent");
const uploadFileInput = document.getElementById("upload_file");
const groupCountInput = document.getElementById("groupCount");

document.getElementById("upload").addEventListener("change", handleFileSelect);

function handleFileSelect(evt) {
    const file = evt.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
        uploadFileInput.value = e.target.result;
        items = e.target.result.split(/\s*,\s*|\n/).filter(line => line.trim() !== "");
    };
    reader.onerror = () => {
        console.error("Error reading file");
    };
    reader.readAsText(file);
}

uploadFileInput.addEventListener("input", updateItemsFromTextArea);

function updateItemsFromTextArea() {
    items = uploadFileInput.value.split(/\s*,\s*|\n/).map(line => line.trim()).filter(line => line !== "");
}

function initializeGroups() {
    const numGroups = parseInt(groupCountInput.value);
    if (numGroups < 1) return;

    parent.innerHTML = ""; 

    const shuffledItems = [...items].sort(() => Math.random() - 0.5);
    const groups = Array.from({ length: numGroups }, () => []);

    shuffledItems.forEach((item, index) => {
        groups[index % numGroups].push(item);   
    });

    groups.forEach((groupItems, index) => {
        const dropzone = createDropzone(index);
        groupItems.forEach((item, i) => {
            const draggable = createDraggable(item, i, index);
            dropzone.appendChild(draggable);
        });
        parent.appendChild(dropzone);
    });
}

function createDropzone(index) {
    const dropzone = document.createElement("div");
    dropzone.classList.add("dropzone"); 
    dropzone.textContent = `Team ${index + 1}`;
    dropzone.ondragover = onDragOver;
    dropzone.ondrop = onDrop;
    return dropzone;
}

function createDraggable(item, index, groupIndex) {
    const draggable = document.createElement("div");
    draggable.classList.add("draggable");
    draggable.setAttribute("draggable", "true");
    draggable.id = `draggable-${groupIndex + 1}-${index}`;
    draggable.textContent = item;
    draggable.ondragstart = onDragStart;
    return draggable;
}

function onDragStart(event) {
    event.dataTransfer.setData('text/plain', event.target.id);
}

function onDragOver(event) {
    event.preventDefault();
}

function onDrop(event) {
    event.preventDefault();
    event.target.style.border = "";

    const id = event.dataTransfer.getData('text');
    const draggableElement = document.getElementById(id);
    const dropzone = event.target;

    if (dropzone.classList.contains('dropzone')) {
        dropzone.appendChild(draggableElement);
        dropzone.style.minHeight = `${dropzone.children.length * 40}px`;
    }

    draggableElement.style.backgroundColor = '';
    event.dataTransfer.clearData();
}

function resetApp() {
    items = [];
    parent.innerHTML = "";
    uploadFileInput.value = "";
    groupCountInput.value = 3;
}
