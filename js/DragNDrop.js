var newId = 0;

function allowDrop(ev) {
    ev.preventDefault();
}

var img = document.createElement("img");

document.body.onmousedown = function(e) {
    e = e || window.event;
    var element = (e.target || e.srcElement);
    var elem = getNode(element);

    if (elem) {
        html2canvas(elem).then(function(canvas) {
            img.src = canvas.toDataURL("image/png");
        });
    }

    function getNode(element) {
        if (element.getAttribute("draggable") == "true") {
            return element;
        } else if ($(element).is("body")) {
            return null;
        } else {
            return getNode(element.parentNode);
        }
    }
}

function drag(ev) {
    ev.dataTransfer.setData("text/html", ev.target.id);
    ev.dataTransfer.setDragImage(img, img.naturalWidth / 2, img.naturalHeight / 2);
    $('[data-toggle=popover]').each(function() {
        $(this).popover('hide');
    });
}

function drop(ev) {
    ev.preventDefault();
    ev.stopPropagation();
    // Update behaviour here
    if (!ev.target.getAttribute("ondrop")) {
        //return false;
    }
    var _data = ev.dataTransfer.getData("text/html");
    // ev.target.appendChild(document.getElementById(data));
    var nodeCopy = document.getElementById(_data).cloneNode(true);
    newId++;
    nodeCopy.id = newId; /* We cannot use the same ID */
    nodeCopy.setAttribute("data-toggle", "popover");
    nodeCopy.setAttribute("data-placement", "right");
    // chipl initiated popover before first click
    // 1. Create template for associated popover
    nodeCopy.controlType = nodeCopy.getAttribute("data-controlType");
    nodeCopy.attribute = {};
    for (var i in data) {
        if (data[i]["Input Type"] == nodeCopy.controlType) {
            for (var att in data[i]["fields"]) {
                nodeCopy.attribute[att] = data[i]["fields"][att];
            }
        }
    }
    nodeCopy.setted = false;
    var popoverContent = createAttributePanel(nodeCopy);
    // 2. Create popover
    $(nodeCopy).popover({
        html: true,
        trigger: 'click',
        title: nodeCopy.controlType,
        content: function() {
            $('[data-toggle=popover]').each(function() {
                // hide any open popovers when the anywhere else in the body is clicked
                // // if (!$(this).is(evt.target) && $(this).has(evt.target).length === 0 && $('.popover').has(evt.target).length === 0) {  
                if (this != nodeCopy) {
                    $(this).popover('hide');
                }
            });

            // console.log('clicked object: ', nodeCopy.id, $(this).data('bs.popover'));
            console.log('clicked object: ', nodeCopy.id, nodeCopy);
            return popoverContent;
        }
    });
    // ev.target.appendChild(nodeCopy);
    document.querySelector("#div2").appendChild(nodeCopy);
}
// Sortable function
$(function() {
        var sortableDiv = document.querySelector("#div2");
        // console.log(sortableDiv);
        $(sortableDiv).sortable({
            receive: function(e, ui) { sortableIn = 1; },
            start: function(e, ui) {
                // modify ui.placeholder however you like
                // ui.placeholder.html("I'm modifying the placeholder element!");
            },
            sort: function(e) {
                // console.log('X:' + e.screenX, 'Y:' + e.screenY);
                $('[data-toggle=popover]').each(function() {
                    // hide any open popovers when the anywhere else in the body is clicked                
                    $(this).popover('hide');
                });

            },
            placeholder: "ui-sortable-placeholder",
            over: function(e, ui) { sortableIn = 1; },
            out: function(e, ui) { sortableIn = 0; },
            beforeStop: function(e, ui) {
                if (sortableIn == 0) {
                    //ui.item.remove();
                    $(ui.item.context).popover('destroy');
                    $('[data-toggle=popover]').each(function() {
                        // hide any open popovers when the anywhere else in the body is clicked
                        // // if (!$(this).is(evt.target) && $(this).has(evt.target).length === 0 && $('.popover').has(evt.target).length === 0) {                     
                        $(this).popover('hide');
                    });
                    ui.item.remove();
                    //console.log("may remove item here", ui.item.context);
                }
            }
        });
        $(sortableDiv).disableSelection();
    })
    // Create controls from JSON definition
$(function CreateControlsTemplate() {
    // body...
    for (i in data) {
        createSingleControlGroup(data[i]);
        console.log("-----------");
    }
})

function createSingleControlGroup(template) {
    newId++;
    var container_div = document.createElement('div');
    container_div.classList.add("row");
    container_div.classList.add("control");
    container_div.setAttribute("draggable", "true");
    container_div.id = newId;
    container_div.addEventListener("dragstart", drag, false);
    //2. Create detail Element
    var label_cover = document.createElement("div");
    var label = document.createElement("Label");
    label.innerHTML = template["label"];
    label_cover.classList.add("col-md-3");
    label_cover.classList.add("col-lg-3");
    label_cover.appendChild(label);
    container_div.appendChild(label_cover);

    var input_cover = document.createElement("div");
    input_cover.classList.add("col-md-9");
    input_cover.classList.add("col-lg-9");
    var input = document.createElement("input");

    switch (template["Input Type"]) {
        case ("text"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "text";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "text");
            break;
        case ("radio"):
            input.type = "radio";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {

                    input.classList.add("col-md-6");
                    input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-6");
                    span.classList.add("col-lg-6");
                    input_cover.appendChild(span);
                }
            }
            container_div.setAttribute("data-controlType", "radio");
            break;
        case ("checkbox"):
            input.type = "checkbox";
            input.name = template["value"];
            if (template["fields"]["options"]) {
                for (item in template["fields"]["options"]) {

                    input.classList.add("col-md-6");
                    input.classList.add("col-lg-6");
                    input.value = item;
                    var copy_radio = input.cloneNode(true);
                    input_cover.appendChild(copy_radio);
                    var span = document.createElement("span")
                    span.innerHTML = template["fields"]["options"][item];
                    span.classList.add("col-md-6");
                    span.classList.add("col-lg-6");
                    input_cover.appendChild(span);
                }
                container_div.setAttribute("data-controlType", "checkbox");
            }
            break;
        case ("number"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "number";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "number");
            break;
        case ("date"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "date";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "date");
            break;
        case ("color"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "color";
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "color");
            break;
        case ("range"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "range";
            if (template["fields"]["min"]) {
                input.min = template["fields"]["min"];
            }
            if (template["fields"]["max"]) {
                input.max = template["fields"]["max"];
            }
            if (template["placeholder"]) {
                input.placeholder = template["placeholder"];
            }
            container_div.setAttribute("data-controlType", "range");
            input_cover.appendChild(input);
            break;
        case ("month"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "month";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "month");
            break;
        case ("week"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "week";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "week");
            break;
        case ("time"):
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "time";
            input_cover.appendChild(input);
            container_div.setAttribute("data-controlType", "time");
            break;

    }

    if (template["fields"]["describe"]) {
        var span = document.createElement("span");
        span.innerHTML = template["fields"]["describe"]["value"];
        span.classList.add("help-block");
        span.classList.add("col-md-12");
        span.classList.add("col-lg-12");
    }
    input_cover.appendChild(span);
    container_div.appendChild(input_cover);
    //Test
    document.querySelector("#div1").appendChild(container_div);
}

function createAttributePanel(nodeCopy) {

    var controlType = nodeCopy.controlType;
    var fileds = nodeCopy.attribute;
    console.log("controlType", controlType);
    console.log("fileds", fileds);

    var main_panel = document.createElement('main_panel');
    main_panel.classList.add("col-md-12");
    main_panel.classList.add("col-lg-12")
    for (var item in fileds) {
        var label = document.createElement("LABEL");
        label.classList.add("col-lg-12");
        label.classList.add("col-md-12");
        main_panel.appendChild(label);
        if (item != "options") {
            label.innerHTML = fileds[item]["label"];
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = fileds[item]["Input Type"];
            input.placeholder = fileds[item]["value"];
            main_panel.appendChild(input);
        }
        if (item == "options") {
            // if (nodeCopy.controlType == "radio"){};
            var input = document.createElement('textarea');
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            label.innerHTML = "options";
            var opt_string = "";
            for (var opt in fileds["options"]) {
                opt_string = opt_string + fileds["options"][opt] + "\n";
            }
            input.value = opt_string;
            main_panel.appendChild(input);
        }

    }
    var cover = document.createElement("cover");
    cover.classList.add("row");
    cover.appendChild(main_panel);
    return cover;
}
