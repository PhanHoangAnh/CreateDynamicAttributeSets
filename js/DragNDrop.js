var newId = 0;



// Sortable function
$(function() {
        var sortableDiv = document.querySelector("#div2");
        // console.log(sortableDiv);
        $(sortableDiv).sortable({
            // connectWith: ".connectedSortable",
            receive: function(e, ui) {
                console.log("receive: ", sortableIn);
                sortableIn = 1;

            },
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
            receive: function(e, ui) {
                ui.sender.sortable("cancel");
            },
            over: function(e, ui) {
                sortableIn = 1;
                // console.log("over from div2: ", sortableIn);
            },
            out: function(e, ui) {
                sortableIn = 0;
            },
            beforeStop: function(e, ui) {
                if (sortableIn == 0) {
                    //ui.item.remove();
                    $(ui.item.context).popover('destroy');
                    $('[data-toggle=popover]').each(function() {
                        // hide any open popovers when the anywhere else in the body is clicked                        
                        $(this).popover('hide');
                    });
                    ui.item.remove();
                }
            }
        });
        $(sortableDiv).disableSelection();
        $("#div1").sortable({
            connectWith: ".connectedSortable",
            remove: function(e, ui) {
                // 
                var nodeCopy = ui.item.clone();
                newId++;
                nodeCopy.id = newId; /* We cannot use the same ID */
                nodeCopy.attr("data-toggle", "popover");
                nodeCopy.attr("data-placement", "right");
                // chipl initiated popover before first click
                // 1. Create template for associated popover
                nodeCopy.controlType = nodeCopy.attr("data-controlType");
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
                            if (this != nodeCopy.get(0)) {
                                $(this).popover('hide');
                            }
                        });
                        //  console.log('clicked object: ', nodeCopy.id, $(this).data('bs.popover'));
                        //  console.log('clicked object: ', nodeCopy.id, nodeCopy);
                        return popoverContent;
                    }
                });
                //nodeCopy.preventDefault;
                nodeCopy.appendTo('#div2');
                $(this).sortable('cancel');
            },
            receive: function(e, ui) {
                ui.sender.sortable("cancel");
            },
            placeholder: "ui-sortable-placeholder",
            out: function(event, ui) {
                $('.placeholder').show();
            }
        }).disableSelection();
    })
    // Create controls from JSON definition
$(function CreateControlsTemplate() {
    // body...
    for (i in data) {
        createSingleControlGroup(data[i]);
        //console.log("-----------");
    }
    setAttributeName();
})

function createSingleControlGroup(template) {
    newId++;
    var container_div = document.createElement('div');
    container_div.classList.add("row");
    container_div.classList.add("control");
    container_div.setAttribute("draggable", "true");
    container_div.id = newId;
    // container_div.addEventListener("dragstart", drag, false);
    //2. Create detail Element
    var label_cover = document.createElement("div");
    var label = document.createElement("Label");
    label.setAttribute("data-controlType", "label");
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
                input_cover.setAttribute("data-controlType", "options");
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
                input_cover.setAttribute("data-controlType", "options");
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
                input.setAttribute("data-controlType", "input");
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
                input.setAttribute("data-controlType", "input");
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
        span.setAttribute("data-controlType", "describe");
    }
    input_cover.appendChild(span);
    container_div.appendChild(input_cover);
    //Test
    document.querySelector("#div1").appendChild(container_div);
}

function createAttributePanel(nodeCopy) {

    var controlType = nodeCopy.controlType;
    var fileds = nodeCopy.attribute;

    var main_panel = document.createElement('main_panel');
    main_panel.classList.add("col-md-12");
    main_panel.classList.add("col-lg-12");
    main_panel.classList.add("clearfix")
    for (var item in fileds) {
        var label = document.createElement("LABEL");
        label.classList.add("col-lg-12");
        label.classList.add("col-md-12");
        main_panel.appendChild(label);
        if (item != "options" && item != "min" && item != "max") {
            label.innerHTML = fileds[item]["label"];
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = fileds[item]["Input Type"];
            input.placeholder = fileds[item]["value"];

            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);

            if (item == "required") {
                var row = document.createElement("div");
                // row.classList.add("row");
                row.classList.add("clearfix");
                row.style.float = "left";
                row.style.width = "100%";
                row.style["padding-top"] = "7px";
                label.classList.remove("col-lg-12");
                label.classList.remove("col-md-12");
                label.classList.add("col-lg-6");
                label.classList.add("col-md-6");
                label.innerHTML = "Require";
                input.classList.remove("col-lg-12");
                input.classList.remove("col-md-12");
                input.classList.add("col-md-6");
                input.classList.add("col-lg-6");
                input.type = fileds[item]["Input Type"];
                input.addEventListener("change", changeControlAttribute, false);
                row.appendChild(label);
                row.appendChild(input);
                main_panel.appendChild(row);
            } else {
                main_panel.appendChild(input);
            }
        }
        if (item == "options") {
            // if (nodeCopy.controlType == "radio"){};
            var input = document.createElement('textarea');
            input.rows = 3;
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            label.innerHTML = "Options";
            var opt_string = "";
            for (var opt in fileds["options"]) {
                opt_string = opt_string + fileds["options"][opt] + "\n";
            }
            input.value = opt_string;
            input.setAttribute("data-controlType", item)
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }
        if (item == "min" || item == "max") {
            label.innerHTML = item;
            var input = document.createElement("input");
            input.classList.add("col-md-12");
            input.classList.add("col-lg-12");
            input.type = "number";
            input.placeholder = "Number only";
            input.setAttribute("data-controlType", item);
            input.addEventListener("change", changeControlAttribute, false);
            main_panel.appendChild(input);
        }

    }
    var hr = document.createElement("hr");
    hr.setAttribute("style", "width: 100%;display: block;float: left;");
    main_panel.appendChild(hr);
    var closeBnt = document.createElement("button");
    closeBnt.classList.add("btn");
    closeBnt.classList.add("btn-primary");
    closeBnt.innerHTML = "Close";
    closeBnt.addEventListener("click", function(evt) {
        $('[data-toggle=popover]').each(function() {
            $(this).popover('hide');
        });
    }, false);

    var controlHandler = document.createElement("div");
    controlHandler.style["text-align"] = "center";
    controlHandler.style["padding-bottom"] = "15px"

    controlHandler.appendChild(closeBnt);

    var cover = document.createElement("cover");
    cover.classList.add("row");
    cover.style.float = "left";
    main_panel.appendChild(controlHandler);
    cover.appendChild(main_panel);
    // Test
    //  document.querySelector("#testPanel").appendChild(cover);

    function changeControlAttribute(evt) {
        //console.log(this.getAttribute("data-controlType"));
        var ctrType = this.getAttribute("data-controlType");
        var controls;
        if (nodeCopy instanceof Node) {
            controls = nodeCopy.querySelectorAll("[data-controlType]");
        } else {
            controls = nodeCopy.get(0).querySelectorAll("[data-controlType]");
        }
        // console.log("is Dom: ", evt.nodeType, "is jquery object", evt.jquery, controls);
        for (var elem in controls) {
            //console.log(controls[elem]);
            if (controls[elem] instanceof Node && controls[elem].getAttribute("data-controltype") == ctrType) {
                if (ctrType == "options") {
                    var optArr = $(this).val().split('\n');
                    //console.log(optArr);
                    var describe = controls[elem].querySelector("[data-controlType='describe']").cloneNode(true);
                    console.log(describe);
                    while (controls[elem].firstChild) {
                        controls[elem].removeChild(controls[elem].firstChild);
                    }

                    // console.log(controls[elem]);

                    var inputType = controls[elem].parentNode.getAttribute("data-controlType");
                    console.log(inputType);
                    var input = document.createElement("input");
                    input.type = inputType;
                    for (var item in optArr) {
                        // Set input name later
                        input.classList.add("col-md-6");
                        input.classList.add("col-lg-6");
                        input.value = item;
                        var copy_radio = input.cloneNode(true);
                        controls[elem].appendChild(copy_radio);
                        var span = document.createElement("span")
                        span.innerHTML = optArr[item];
                        span.classList.add("col-md-6");
                        span.classList.add("col-lg-6");
                        controls[elem].appendChild(span);
                    }
                    controls[elem].appendChild(describe);
                } else {
                    controls[elem].innerHTML = this.value;
                }

            }
        }
        //receiver = nodeCopy.querySelector([queryStr]);
    }
    return cover;
}

function setAttributeName() {
    var legent = document.querySelector("#SetsName");
    // var legent = $(_legent);
    legent.setAttribute("data-toggle", "popover");
    legent.setAttribute("data-placement", "right");
    //legent.controlType = legent.getAttribute("data-controlType");
    legent.attribute = {};
    legent.attribute["label"] = {
        "label": "Set Attributes Set Name",
        "Input Type": "text",
        "value": "Text Input"
    }

    legent.setted = false;
    var _Content = createAttributePanel(legent);
    // 2. Create popover
    $(legent).popover({
        html: true,
        // trigger: 'click',
        title: "Set Attributes Name",
        content: function() {
            $('[data-toggle=popover]').each(function() {
                if (this != legent) {
                    $(this).popover('hide');
                }
            });
            return _Content;
        }
    });
}
