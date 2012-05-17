var isIE = navigator.appName.indexOf("Microsoft") != -1;
var isIE5 = navigator.userAgent.indexOf('MSIE 5.0') > 0;
var isOpera = navigator.userAgent.indexOf("Opera") != -1;
var isSafari = navigator.userAgent.indexOf("AppleWebKit") != -1;
var isFirefox = navigator.userAgent.indexOf( "Firefox/" ) != -1;
var isNetscape = navigator.userAgent.indexOf( "Netscape/" ) != -1;

var lastMouseX;
var lastMouseY;
var curPopupWindow = null;
var closeOnParentUnloadWindow = null;
var helpWindow = null;
var win = null;

var editPage = false;

var currentEntityId = '';
var currentEntityId2 = ''; //used for person acct

// ignore marker value (_\1_) for dependent list with no applicable values
var picklistNAMarker = '_\1_';

if (!window.Jiffy) {
    Jiffy = {
        measure: function() {},
        mark: function() {}
    };
}

var beenFocused = false;
document.onmousedown = markFocused;
function markFocused() {
    beenFocused = true;
}

/**
 * Track the element with focus.
 */
var focusedElement = null;
if (document.addEventListener) {
    document.addEventListener('focus', trackFocused, false);
} else if (document.attachEvent) {
    document.attachEvent('onFocus', trackFocused);
}
function trackFocused(e) {
    if (window.event) {
        focusedElement = window.event.target;
    } else {
        focusedElement = e.target;
    }
}

/**
 * Call this to explicitly reset the focus. The arguments to this function
 * are a variable number of pairs of strings such as (X0a, X0b, X1a, X1b, ..., Xna, Xnb),
 * where if the id of the element with focus is Xia, the element that will
 * receive focus instead will be Xib.
 *
 * This is used in partial refresh when it is possible that an element with
 * a different id replaces the original.
 */
function reFocus() {
    if (focusedElement && focusedElement.focus) {
        var id = focusedElement.id
        if (id) {
            // has id, so find replacement...
            var args = reFocus.arguments;
            for (var i = 0; i < args.length; i = i + 2) {
                if (id == args[i]) {
                    var newFocused = document.getElementById(args[i+1]);
                    if (!hiddenOrDisabled(newFocused)){
                        newFocused.focus();
                    }
                    // save new focused element
                    focusedElement = newFocused;
                    return;
                }
            }
            // ... no replacement found
            var newFocused = document.getElementById(id);
            if (newFocused && newFocused.focus && !hiddenOrDisabled(newFocused)) {
                newFocused.focus();
                focusedElement = newFocused;
            }
        }
    }
}

/**
 * This function should be called by every entity detail and edit page to set the current entity name and ID.
 * It's used by the CTI integration to attach the current object to a call.
 */
function setEntityInformation(entityName,entityLabel,entityDevName,entityId,isEditPage, entityAllowsActivities, id2)
{
    currentEntityId = entityId;
    currentEntityId2 = id2;

    var theWindow;
    // see if we're in desktop mode
    if (self.getAccessibleParentWindow) {
        theWindow = getAccessibleParentWindow(self);
    } else {
        theWindow = self;
    }

    editPage = isEditPage;

    // Add log object only if it allows activities.
    // See Bug #181716: Objects should not be added to the call log if activities can't be created on them
    if (entityAllowsActivities) {
        if (theWindow) {
            if (theWindow.sendCTIMessage) {
                theWindow.sendCTIMessage('ADD_LOG_OBJECT?ID='+entityId+'&OBJECT_LABEL=' + escape(entityLabel)+'&ENTITY_NAME='+entityDevName+'&OBJECT_NAME=' + escape(entityName));
            }
            if (theWindow.cleanupClickToDial)
                theWindow.cleanupClickToDial();
        }
    }
}
function copyInnerHTML(src, dest) {
    dest.innerHTML = src.innerHTML;
}

function setLastMousePosition(e) {
    if (navigator.appName.indexOf("Microsoft") != -1) e = window.event;
    lastMouseX = e.screenX;
    lastMouseY = e.screenY;
}

function openClickout(url) {
    openClickoutWithSize(url, 640, 480);
}

function openClickoutWithSize(url, width, height) {
    window.open(url, "_blank", 'width=' + width + ',height=' + height + ',dependent=no,resizable=yes,toolbar=yes,status=yes,directories=yes,menubar=yes,scrollbars=1', false);

}

function openIntegration(url, props, positionType) {
    var newWindow = window.open(url, "_blank", props, false);
    if (positionType == 2){
        newWindow.moveTo(0, 0);
    } else if (positionType == 0){
        newWindow.moveTo(0, 0);
        newWindow.resizeTo(self.screen.width, self.screen.height);
    }
}

/**
 * Calls through to the openPopupFocus() with closeOnLoseFocus set to true.
 */
function openPopup(url, name, pWidth, pHeight, features, snapToLastMousePosition) {
    openPopupFocus (url, name, pWidth, pHeight, features, snapToLastMousePosition, true);
}

/**
 * Used for help popup links that need #'s escaped inline.
 */
function openPopupFocusEscapePounds(url, name, pWidth, pHeight, features, snapToLastMousePosition, closeOnLoseFocus) {
    openPopupFocus (url.replace("#","%23"), name, pWidth, pHeight, features, snapToLastMousePosition, closeOnLoseFocus);
}

/**
 * Handles popup windows.
 * If snapToLastMousePosition is true, then the popup will open up near the mouse click.
 * If closeOnLoseFocus is true, then it will close when the user clicks back into the browser window that opened it.
 */
function openPopupFocus(url, name, pWidth, pHeight, features, snapToLastMousePosition, closeOnLoseFocus, closeOnParentUnload) {
    closePopup();

    if (snapToLastMousePosition) {
        if (lastMouseX - pWidth < 0) {
            lastMouseX = pWidth;
        }
        if (lastMouseY + pHeight > screen.height) {
            lastMouseY -= (lastMouseY + pHeight + 50) - screen.height;
        }
        lastMouseX -= pWidth;
        lastMouseY += 10;
        features += ",screenX=" + lastMouseX + ",left=" + lastMouseX + ",screenY=" + lastMouseY + ",top=" + lastMouseY;
    }

    if (closeOnLoseFocus) {
        curPopupWindow = window.open(url, name, features, false);
        curPopupWindow.focus ();
    } else {
        // assign the open window to a dummy var so when closePopup() is called it won't be assigned to curPopupWindow
        win = window.open(url, name, features, false);
        win.focus ();
    }

    if (closeOnParentUnload) {
        closeOnParentUnloadWindow = win;
    }
}

function openPopupFocusWithOffset(url, features, xOffset, yOffset) {
    win = window.open(url, '', features);
    win.moveTo(window.pageXOffset+xOffset,window.pageYOffset+yOffset);
    win.focus();
}

function closePopup() {
    if (curPopupWindow != null) {
        try {
           if (curPopupWindow.confirmOnClose) {
               if (curPopupWindow.confirm(curPopupWindow.confirmOnCloseLabel)) {
                   curPopupWindow.confirmOnClose = false;
                   curPopupWindow.focus();
                   return false;
               }
           }
           curPopupWindow.close();
        } catch(ex) {
            // This Exception code is to deal with IE issues checking
            // The window's closed property
        }
        curPopupWindow = null;
    }
}

/* Cross-platform handling of complex modal dialog boxes */
var modalWindow = null;
function ignoreModalEvents(e) {return false;}
function handleModalFocus() {
    if (modalWindow) {
        if (modalWindow.closed) {
            window.top.releaseEvents(Event.CLICK | Event.FOCUS);
            window.top.onclick="";
        } else {
            modalWindow.focus();
        }
    }
    return false;
}
// Invoke the result function
function invokeResultFunc() {
    var resultFunc;
    if (window.dialogArguments) {
        resultFunc = window.dialogArguments;
    } else {
        resultFunc = window.opener.resultFunc;
    }
    resultFunc();
}
function openPopupModal(url, name, pWidth, pHeight, features, resultFunc, fallbackFunc) {
    if (window.showModalDialog) {
        var result = window.showModalDialog(url,resultFunc==null?window:resultFunc,features);
    } else if (window.top.captureEvents) {
        window.top.captureEvents(Event.CLICK|Event.FOCUS);
        window.top.onclick=ignoreModalEvents;
        window.top.onfocus=handleModalFocus;
        modalWindow = window.open(url, name, features+",modal=yes");
        if (resultFunc) window.resultFunc = resultFunc;
    } else {
        if (fallbackFunc) return fallbackFunc();
        return openPopup(url,name,pWidth,pHeight,features,false);
    }
}
// Handle confirmations in a unified fashion
var clickedLink,warningText;
function confirmPopup(dialogUrl,w,h,features,destLink,warnText) {
    clickedLink = destLink.href ? destLink.href : destLink;
    warningText = warnText;
    var resultFunc = new Function("window.location = clickedLink");
    resultFunc.window = window;
    openPopupModal(dialogUrl,"_blank",w,h,features,
        resultFunc,
        new Function("return confirm(warningText)"));
    return false;
}

function openLookup(baseURL,width,modified,searchParam) {
    if (modified == '1') baseURL = baseURL + searchParam;
    openPopup(baseURL, "lookup", 350, 480, "width="+width+",height=480,toolbar=no,status=no,directories=no,menubar=no,resizable=yes,scrollable=no", true);
}

function pick(form,field,val,callOnchange) {
    document.getElementById(form)[field].value = val;
    if (callOnchange) {
        document.getElementById(form)[field].onchange();
    }
    closePopup();
    return false;
}

function pickSubmit(form,field,val, callOnchange) {
    document.getElementById(form)[field].value = val;
    if (callOnchange) {
        document.getElementById(form)[field].onchange();
    }
    document.getElementById(form).submit();
    closePopup();
    if (!hiddenOrDisabled(document.getElementById(form)[field])){
        document.getElementById(form)[field].focus();
        document.getElementById(form)[field].select();
    }
    return false;
}

function hiddenOrDisabled(element){
    var parent = element;
    do {
        if (parent == null || parent.type == "hidden"
            || parent.disabled || getCurrentStyle(parent, "display") == "none"
            || getCurrentStyle(parent, "visibility") == "hidden") {
            return true
        };
        parent = parent.parentNode;
    } while (parent != null && parent.tagName != 'BODY');

    return false;
}

function hiddenOrDisabledOrReadOnly(element){
    var parent = element;
    do {
        if (parent == null || parent.type == "hidden"
            || parent.readOnly
            || parent.disabled || getCurrentStyle(parent, "display") == "none"
            || getCurrentStyle(parent, "visibility") == "hidden") {
            return true
        };
        parent = parent.parentNode;
    } while (parent != null && parent.tagName != 'BODY');

    return false;
}

function pickcolor(form, field, val) {
    var newval = parseInt(val, 16);
    var fieldEl = document.getElementById(form)[field];

    // Allow for the use of application specific setters
    if (fieldEl.setValue) {
        fieldEl.setValue(newval);
    } else {
        fieldEl.value = newval;
    }

    document.getElementById(field + "cell").style.backgroundColor = "#" + val;

    closePopup();
    return false;
}

function comboBoxPick (form, fieldName, comboBoxArrayName, index) {
    // get the field we are inserting the value into
    var field = document.getElementById(form)[fieldName];

    if (field != null) {
        // get to the javascript array for this combobox
        var comboBoxArray = eval (comboBoxArrayName);
        if (comboBoxArray != null) {

            if (index >= 0 && index < comboBoxArray.length) {
                // if we pass the bounds check, assign the value
                field.value = comboBoxArray[index];
                if (!hiddenOrDisabled(field)){
                    field.focus();
                    field.select();
                }
            }
        }
    }
    closePopup ();
    return false;
}

function listProperties(obj) {
    var names = "";
    for (var i in obj) names += i + ", ";
    alert(names);
}

function attachEventToElement(elem, evtString, evtFunction) {
    if (elem.addEventListener) {
        elem.addEventListener (evtString,evtFunction,false);
    } else if (elem.attachEvent) {
        elem.attachEvent("on" + evtString,evtFunction);
    }
}


function navigateToUrl(url) {
    window.location = url;
}


// Should use HTTPRequest object when that becomes available.
// Won't need to the unlocalized title attribute when we use the HTTPRequest object.
function hitUrl(url) {
    // create an iFrame to call out to the url
    var b = document.getElementsByTagName('body')[0];
    var frameId = 'goToUrlFrame';
    var frameElem = document.getElementById(frameId);
    if (!frameElem) {
        var divElem = document.createElement('div');
        divElem.style.display = 'none';
        b.appendChild(divElem);
        // Must do this because the name attribute in IE cannot be set
        divElem.innerHTML = '<iframe src="javascript:false" style="display:none;" id="' + frameId + '" name="' + frameId + '"></iframe>';
        frameElem = document.getElementById(frameId);
        frameElem.title = 'blank - ignore';
    }
    var formElem = document.createElement('form');
    b.appendChild(formElem);
    formElem.target = frameId;
    formElem.method = 'POST';
    formElem.action = url;
    formElem.submit();
    b.removeChild(formElem);

}

/**
 * @param formName  Name of the HTML form
 * @param elements  A map of elements (see lookupPick and lookupPick2)
 * @param id 		The 15-char Id of the record that was chosen
 * @param display	The display name of the record that was chosen
 * @param allowOverwrite (from lookupPick2), if extraName and extraId are present, overwrite the values of the extra field even if it already has a value
 * @param allowOverwriteIfMatchesParent Change the behavior of what the extraNameElement is for.  Bascially, true if it came from lookupPick, false if from lookupPIck2
 * @param relatedFieldValue see below
 * @param extraName the display name for the extra lookup to be filled in
 * @param extraId the id for the extra lookup to be filled in
relatedFieldName/Value are for copying in a value other than the selected name.
extraNameElementName identifies another element on the parent page to copy the name again (if the element is empty).
*/
function doLookupPick(formName, elements, id, display, allowOverwrite, allowOverwriteIfMatchesParent, relatedFieldValue, extraName, extraId){
    var parentIdElement = elements.parentIdElement;
    var parentEditElement = elements.parentEditElement;
    var parentEditElementName = parentEditElement.name;
    var parentEditOldValueElement = elements.parentEditOldValueElement;

    if (parentIdElement.type == "select-one") {
        var found = false;
        for (i = 0; i < parentIdElement.options.length; i++) {
            if (parentIdElement.options[i].value == id ) {
                parentIdElement.selectedIndex = i;
                found = true;
                break;
            }
        }
        if (!found) {
            parentIdElement.options[parentIdElement.options.length] = new Option(display, id);
            parentIdElement.selectedIndex = parentIdElement.options.length - 1;
        }
        parentEditElement.value = display;
        parentEditOldValueElement.value = display;
    } else {
        // If we want to default display text into another field, make sure
        // the field's either empty or matches our parent lookup's value exactly
        if (elements.extraNameElement) {
            //These could be consolidated, but they behave *slightly* differently, and it's too late to test them well enough
            if (allowOverwriteIfMatchesParent){
                //old lookupPick
                if (elements.extraNameElement.value.length == 0 || elements.extraNameElement.value == parentEditElement.value) {
                    elements.extraNameElement.value = display;
                }
            } else {
                //old lookupPick2
                if (allowOverwrite ||  (elements.extraNameElement.value == null || elements.extraNameElement.value == '')) {
                    if (extraName != null && extraName != '') {
                         elements.extraNameElement.value = extraName;
                         if (elements.extraIdElement) {
                             elements.extraIdElement.value = extraId;
                         }
                         if (elements.extraEditOldValueElement) {
                             elements.extraEditOldValueElement.value = extraName;
                         }
                    }
                 }
            }
        }

        parentIdElement.value = id;
        parentEditElement.value = display;
        parentEditOldValueElement.value = display;
        if (window.ForeignKeyInputElement) { // regular edit (also called during inline edit)
            ForeignKeyInputElement.dispatchLookupChange(parentEditElement.name);
        }

        if (window.sfdcPage && sfdcPage.getFieldById) { // inline edit
            var field = sfdcPage.getFieldById(parentEditElement.name);
            if (field) {
                field.lookupPickCalled();
            }
        }

    }

    if (elements.relatedFieldElement) {
        elements.relatedFieldElement.value = relatedFieldValue;
    }

    var onPick = getElementByIdCS(parentEditElementName+ '_onpk');
    if (onPick && onPick.value != '') {
        // have to fire this asynch to avoid Mozilla bug #246518
        setTimeout(function() { eval(onPick.value); }, 1);
    }

    var parentSubmitParam = getElementsByNameCS(parentEditElementName+ '_lspf')[0];
    if (parentSubmitParam && parentSubmitParam.value == '1') {
        var autoSubmitedElement = getElementsByNameCS(parentEditElementName + '_lspfsub')[0];
        if(autoSubmitedElement){
               autoSubmitedElement.value="1";
           }
        document[formName].submit();
    }

    if(elements.modElement){   // mark the field as modified
          elements.modElement.value = "1";
    }

    closePopup();

    if (!hiddenOrDisabled(parentEditElement)){
        parentEditElement.focus();
        parentEditElement.select();
    }

    return false;
}

function lookupPick(formName, parentIdElementName, parentEditElementName, relatedFieldName, id, display, relatedFieldValue, extraNameElementName) {
    var elements = {
            parentIdElement : getElementsByNameCS(parentIdElementName)[0],
            parentEditElement : getElementsByNameCS(parentEditElementName)[0],
            parentEditOldValueElement : getElementsByNameCS(parentEditElementName + "_lkold")[0],
            relatedFieldElement : getElementsByNameCS(relatedFieldName)[0],
            extraNameElement : getElementsByNameCS(extraNameElementName)[0],
            modElement : getElementsByNameCS(parentEditElementName + "_mod")[0]
    };
    return doLookupPick(formName, elements, id, display, false, true, relatedFieldValue);
}

function lookupPick2(formName, parentIdElementName, parentEditElementName, id, display, extraNameElementName, extraName, extraIdElementName, extraId, allowOverwrite) {
    var elements = {
            parentIdElement : getElementsByNameCS(parentIdElementName)[0],
            parentEditElement : getElementsByNameCS(parentEditElementName)[0],
            parentEditOldValueElement : getElementsByNameCS(parentEditElementName + "_lkold")[0],
            extraNameElement : getElementsByNameCS(extraNameElementName)[0],
            extraIdElement : getElementsByNameCS(extraIdElementName)[0],
            extraEditOldValueElement : getElementsByNameCS(extraNameElementName + "_lkold")[0],
            modElement : getElementsByNameCS(parentEditElementName + "_mod")[0]
    };

    return doLookupPick(formName, elements, id, display, allowOverwrite, false, null, extraName, extraId);
}

function searchEntityTwo (isAll,allID,entityName) {
    var allBox = document.getElementById(allID);
    if (isAll) {
        allBox.checked = true;
        var elems = document.getElementsByName(entityName);
        if(!elems) return;
        for (i=0; i < elems.length; ++i) {
            if (elems[i] != allBox) elems[i].checked = false;
        }
    } else {
        allBox.checked = false;
    }
}

/**
 * This function does for LookupPhoneInputElements what lookupPick() does for LookupInputElements. The
 * reason this is separate is LookupPhoneInputElement is much simpler and doesn't require all the bells and
 * whistles of lookupPick().
 */
function lookupPhonePick(parentId, newValue) {
    var parentElement = document.getElementById(parentId);
    parentElement.value = newValue;
    closePopup();
    parentElement.focus();
    parentElement.select();
}

function setFocusOnLoad() {
    if (!beenFocused) { setFocus(); }
}

function elementFocus(element){
    if (!hiddenOrDisabled(element)){
        element.focus();
    }
}

function elementSelect(element){
    if (!hiddenOrDisabled(element)){
        element.select();
    }
}

function setFocus() {
    // search for a tabIndexed field to focus on
    for(var firstIndex=1; firstIndex < 5; firstIndex ++ ){
        var nextIndex = firstIndex;
        for (var frm = 0; frm < document.forms.length; frm++) {
            for (var fld = 0; fld < document.forms[frm].elements.length; fld++) {
                var elt = document.forms[frm].elements[fld];
                if ( elt.tabIndex != nextIndex) continue;
                if ((elt.type == "text" || elt.type == "textarea" || elt.type == "password") && !hiddenOrDisabledOrReadOnly(elt)
                   && elt.name != "sbstr" &&  elt.name.indexOf("owner") != 0 && elt.name.indexOf("tsk1") != 0 && elt.name.indexOf("evt1") != 0) {
                    elt.focus();
                    if (elt.type == "text" && !hiddenOrDisabledOrReadOnly(elt)) {
                        elt.select();
                    }
                    return true;
                } else {
                    nextIndex++;
                    fld = 0;
                }
            }
        }
    }

    // failed to find a tabIndexed field, try to find the field based on it's natural position.
    // TODO: is this even needed anymore?
    for (var frm = 0; frm < document.forms.length; frm++) {
        if (document.forms[frm].name != "sbsearch" && document.forms[frm].name != "srch_solution_sbar" &&
            document.forms[frm].name != "srch_product_sbar" && document.forms[frm].name != "srch_document_sbar") {
            for (var fld = 0; fld < document.forms[frm].elements.length; fld++) {
                var elt = document.forms[frm].elements[fld];
                // skip buttons, radio, or check-boxes
                // to skip "select" types, remove from if statement
                if ((elt.type == "text" || elt.type == "textarea" || elt.type == "password") && !hiddenOrDisabledOrReadOnly(elt) &&
                     elt.name.indexOf("owner") != 0 && !hiddenOrDisabledOrReadOnly(elt)) {
                    elt.focus();
                    // select text in text field or textarea
                    if (elt.type == "text" && !hiddenOrDisabledOrReadOnly(elt)) {
                        elt.select();
                    }
                    return true;
                }
            }
        }
    }

    return true;
}

function setNamedFocus(element_name) {
    for (var frm = 0; frm < document.forms.length; frm++) {
        for (var fld = 0; fld < document.forms[frm].elements.length; fld++) {
            var elt = document.forms[frm].elements[fld];
            if (elt.name == element_name && !hiddenOrDisabled(elt)) {
                elt.focus();
                if (elt.type == "text" && !hiddenOrDisabled(elt)) {
                    elt.select();
                }
                return true;
            }
        }
    }
    return true;
}

function formatPhoneOnEnter(field, evt) {
    var e = getEvent(evt);
    var key = e.keyCode;


    if (key == KEY_ENTER) {
        formatPhone(field);
    }
}

function formatPhone (field) {
    field.value = trim(field.value);

    var ov = field.value;
    var v = "";
    var x = -1;

    // is this phone number 'escaped' by a leading plus?
    if (0 < ov.length && '+' != ov.charAt(0)) { // format it
        // count number of digits
        var n = 0;
        if ('1' == ov.charAt(0)) {  // skip it
            ov = ov.substring(1, ov.length);
        }

        for (i = 0; i < ov.length; i++) {
            var ch = ov.charAt(i);

            // build up formatted number
            if (ch >= '0' && ch <= '9') {
                if (n == 0) v += "(";
                else if (n == 3) v += ") ";
                else if (n == 6) v += "-";
                v += ch;
                n++;
            }
            // check for extension type section;
            // are spaces, dots, dashes and parentheses the only valid non-digits in a phone number?
            if (! (ch >= '0' && ch <= '9') && ch != ' ' && ch != '-' && ch != '.' && ch != '(' && ch != ')') {
                x = i;
                break;
            }
        }
        // add the extension
        if (x >= 0) v += " " + ov.substring(x, ov.length);

        // if we recognize the number, then format it
        if (n == 10 && v.length <= 40) field.value = v;
    }
    return true;
}

function clearcols () {
    for (var frm = 0; frm < document.forms.length; frm++) {
        for (var fld = 0; fld < document.forms[frm].elements.length; fld++) {
            var elt = document.forms[frm].elements[fld];
            if (elt.name == "c" || elt.name.substring(0,2) == "c_") {
                elt.checked = false;
            }
        }
    }
}

function setcols () {
    for (var frm = 0; frm < document.forms.length; frm++) {
        for (var fld = 0; fld < document.forms[frm].elements.length; fld++) {
            var elt = document.forms[frm].elements[fld];
            if (elt.name == "c" || elt.name.substring(0,2) == "c_") {
                elt.checked = true;
            }
        }
    }
}

function setUsername(uname, fname, lname, suffix) {
    if (uname.value.length == 0) {
        uname.value =
                    fname.value.substring(0,1).toLowerCase()
                    + lname.value.toLowerCase()
                    + "@"
                    + suffix.value;
    }
}
function setAlias(alias, fname, lname) {
    if (alias.value.length == 0) {
        alias.value = fname.value.substring(0,1).toLowerCase() +
                      lname.value.substring(0,4).toLowerCase();
    }
}

// POPUP WINDOW NUMBER 1
function popWin(url) {
    closePopup();
    curPopupWindow = window.open(url,"win","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,width=550,height=300",false);
}
/**
 * Do NOT remove this function!
 * This function is used from within our help docs.
 */
function popWin2(url) {
   win = window.open(url,"win","toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable=0,width=720,height=500",false);
}

/**
 * Do NOT remove this function!
 * Our help docs tell our customers to use this call to open links up in a new browser window.
 */
function adminWin(url) {
   win = window.open(url,"win","toolbar=1,location=1,directories=0,status=1,menubar=1,scrollbars=1,resizable=1,width=800,height=600",false);
}

// Changed name of window for printWin so that Printable views do not disappear
// Newname is popWin, Oldname(changed) was curPopupWindow
function printWin(url) {
  popWin = window.open(url,"win","dependent=no,toolbar=1,directories=0,location=0,status=1,menubar=1,scrollbars=1,resizable=1,width=705,height=400",false);
  popWin.focus();
}

/* DUELING */
function moveSelectElement3(sourceSelect, targetSelect, sourceLabel, targetLabel, keepTarget) {
    if (sourceSelect.selectedIndex > -1) {
        for (i=0; i < sourceSelect.length; ++i) {
            var selectedOption = sourceSelect.options[i];
            if (selectedOption.selected) {
                if (selectedOption.text != sourceLabel) {
                    var newOption = new Option(selectedOption.text, selectedOption.value);
                    newOption.title = selectedOption.title;
                    if (targetSelect.options.length > 0 && targetSelect.options[0].text == targetLabel) {
                        targetSelect.options[0] = newOption;
                        targetSelect.selectedIndex = 0;
                    } else {
                        targetSelect.options[targetSelect.options.length] = newOption;
                        targetSelect.selectedIndex = targetSelect.options.length - 1;
                    }
                } else {
                    sourceSelect.selectedIndex = -1;
                }
            }
        }
        if(!keepTarget) {
            removeSelectElement3(sourceSelect, sourceLabel);
        }
    }
}

function sortOrderNumeric(a, b) { return a - b; }
function sortOrderNumericReverse(a, b) { return b - a; }

function moveSelectElementIds(sourceSelect, targetSelect, ids, keepTarget, sourceLabel) {
    if (ids) {
        // Copy over the new ones
        var targetOptions = targetSelect.options;
        for (i=0; i< ids.length ; i++) {
            var selectedOption = sourceSelect.options[ids[i]];
            var newOption = new Option(selectedOption.text, selectedOption.value);
            newOption.title = selectedOption.title;
            // replace the target if it is the special "none" value
            if (targetOptions.length == 1 && targetOptions[0].text == sourceLabel) {
                targetOptions[0] = newOption;
                targetOptions[0].selected = true;
            } else {
                targetOptions[targetOptions.length] = newOption;
            }
        }
        // Remove the old ones
        if (!keepTarget) {
            ids = ids.sort(sortOrderNumericReverse);  // sort to keep them in order
            for (i = 0; i < ids.length; i++) {
                sourceSelect.options[ids[i]]=null;
            }
            if (sourceSelect.length == 0) {
                var placeHolder = new Option(sourceLabel, sourceLabel);
                sourceSelect.options[0] = placeHolder;
            }
        }
    }
}

/**
 * @deprecated use static method DuelingListBoxesElement.moveOption() instead
 */
function moveOption (sourceSelect, targetSelect, keepSourceLabel,
                     unmovableSourceValues, unmovableAlertMessages,
                     keepTargetLabel, cannotBeEmpty, cannotBeEmptyMessage, warnDivId) {
    DuelingListBoxesElement.moveOption(sourceSelect, targetSelect, keepSourceLabel, unmovableSourceValues,
        unmovableAlertMessages, keepTargetLabel, cannotBeEmpty, cannotBeEmptyMessage, warnDivId);
}


function removeSelectElement3(sourceSelect, sourceLabel)
{   if (sourceSelect.selectedIndex > -1)
    {   for (i=sourceSelect.length-1; i > -1; i--)
        {   if (sourceSelect.options[i].selected) sourceSelect.options[i] = null;
        }
        if (sourceSelect.length == 0)
        {   var placeHolder = new Option(sourceLabel, sourceLabel);
            sourceSelect.options[0] = placeHolder;
        }
    }
}

/**
 * @deprecated use static method DuelingListBoxesElement.moveUp() instead
 */
function moveUp(sourceSelect, topSourceValue, radicalValue, unmovableAlertMessage, warnDivId) {
    return DuelingListBoxesElement.moveUp(sourceSelect, topSourceValue, radicalValue, unmovableAlertMessage, warnDivId);
}

/**
 * @deprecated use static method DuelingListBoxesElement.moveDown() instead
 */
function moveDown(sourceSelect, topSourceValue, radicalValue, unmovableAlertMessage, warnDivId) {
    return DuelingListBoxesElement.moveDown(sourceSelect, topSourceValue, radicalValue, unmovableAlertMessage, warnDivId);
}

/**
 * @deprecated use static method DuelingListBoxesElement.moveTop() instead
 */
function moveTop(sourceSelect, warnDivId) {
    return DuelingListBoxesElement.moveTop(sourceSelect, warnDivId);
}

/**
 * @deprecated use static method DuelingListBoxesElement.moveBottom() instead
 */
function moveBottom(sourceSelect, warnDivId) {
    DuelingListBoxesElement.moveBottom(sourceSelect, warnDivId);
}

/**
 * Used when submitting a dueling list boxes element.
 * Stores all the values into hidden form parameters so we can get them out
 *
 * @deprecated use static method DuelingListBoxesElement.saveAllSelected() instead
 */
function saveAllSelected (fromSelectArray, toArray, delim, escape, emptyLabel) {
    DuelingListBoxesElement.saveAllSelected(fromSelectArray, toArray, delim, escape, emptyLabel);
}

/** Function to deal with multiple dropdowns */
function ddChangeAllElements(object,elemIds) {
  var index = object.selectedIndex;
  if (index > 0) {
    for (var i = 0; i < elemIds.length; i++) {
      var elem = getElementByIdCS(elemIds[i]);
      if (elem) elem.selectedIndex = index - 1;
    }
  }
}
function ddElementChange(object,elemIds,overrideId) {
    var initial = getElementByIdCS(elemIds[0]).selectedIndex;
    for (var i = 1; i < elemIds.length; i++) {
        var elem = getElementByIdCS(elemIds[i]);
        if (elem.selectedIndex != initial) {
            initial = -1;
            break;
        }
    }
    getElementByIdCS(overrideId).selectedIndex = initial + 1;
}

function ddRadioClicked(control,elemIds,overrideId) {
    var isAll = control.value == 'all';
    document.getElementById(overrideId).disabled = !isAll;
    for (var i = 0; i < elemIds.length; i++) {
        var elem = getElementByIdCS(elemIds[i]);
        if (elem) elem.disabled = isAll;
        if (isAll) {
            var index = getElementByIdCS(overrideId).selectedIndex;
            if (index > 0) elem.selectedIndex = index - 1;
        }
    }
}

function openwizard(url, name, resizable) {
  var win = window.open('', name, 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable='+resizable+',width=675,height=550,screenx=50,screeny=10,left=50,top=10',false)
  if ((win.document.URL == '') || (win.document.URL == 'about:blank')) win.location = url;
  win.focus ();
}

function openwizard2(url, name, resizable) {
  var win = window.open(url, name, 'toolbar=0,location=0,directories=0,status=0,menubar=0,scrollbars=1,resizable='+resizable+',width=675,height=550,screenx=50,screeny=10,left=50,top=10',false)

}

function escapeUTF(src) {
    var ret = "";
    for (i = 0; i < src.length; i++) {
        var ch = src.charCodeAt(i);
        if (ch <= 0x7F) {
            ret += escape(src.charAt(i));
        } else if (ch <= 0x07FF) {
            ret += '%' + ((ch >> 6) | 0xC0).toString(16) + '%' + ((ch & 0x3F) | 0x80).toString(16);
        } else if (ch >= 0x0800) {
            ret += '%' + ((ch >> 12) | 0xE0).toString(16) +
                   '%' + (((ch >> 6) & 0x3F) | 0x80).toString(16) + '%' + ((ch & 0x3F) | 0x80).toString(16);
        }
    }
    return ret;
}

function openRefer(url) {
    window.open(url, 'referv2', 'resizable=no,toolbar=no,status=no,directories=no,scrollbars=yes,width=420,height=500', false);
}

function changeOpenerWindowLocation (url) {
    if ((window.top.opener == null) || window.top.opener.closed) {
        window.top.open (url);
    } else {
        window.top.opener.location.href = url;
        window.top.opener.focus ();
    }
}

function verifyUnderLimit(form, element_name, limit, errorMessage) {
    var count = 0;
    for (i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name == element_name && form.elements[i].checked) {
            if (++count > limit) {
                alert(errorMessage);
                return false;
            }
        }
    }

    return true;
}

function verifyChecked(form, element_name, errorMessage) {
    for (i = 0; i < form.elements.length; i++) {
        if ((form.elements[i].name == element_name) && form.elements[i].checked) {
            return true;
        }
    }

    // if we haven't returned yet, it's not checked
    alert(errorMessage);
    return false;
}

function verifyCheckedByPrefix(form, elementNamePrefix, errorMessage) {
    for (i = 0; i < form.elements.length; i++) {
        if ((form.elements[i].name.indexOf(elementNamePrefix) == 0) && form.elements[i].checked) {
            return true;
        }
    }

    // if we haven't returned yet, it's not checked
    alert(errorMessage);
    return false;
}


function verifySingleCheckedByPrefix(form, elementNamePrefix, errorMessage) {
    var numChecked = 0;
    for (i = 0; i < form.elements.length; i++) {
        if ((form.elements[i].name.indexOf(elementNamePrefix) == 0) && form.elements[i].checked) {
            numChecked++;
        }
    }

    if (numChecked == 1) {
       return true;
    }
    alert(errorMessage);
    return false;
}

function verifyCheckedWarning(form, element_name, errorMessage) {
    var isChecked = false;
    for (i = 0; i < form.elements.length; i++) {
        if ((form.elements[i].name == element_name) && form.elements[i].checked) {
            isChecked = true;
        }
    }
    if (isChecked) {
        return window.confirm(errorMessage);
    }
    return true;
}

function submitFormActionURL (form, url) {
    form.action = url;
    form.submit();
}

function updateToggleAllBox(form, element_name) {
    // Can be undefined when 0 items in list:
    if (form.allBox) {
        form.allBox.checked = allChecked(form, element_name);
    }
}

function allChecked(form, element_name) {
    var i = 0;

    for (i = 0; i < form.elements.length; i++) {
        var el = form.elements[i];
        if (el.name == element_name && el.type=="checkbox" && el.checked == false) {
            return false;
        }
    }
    return true;
}

function SelectChecked(form, element_name, value)
{
    var i = 0;
    for (i = 0; i < form.elements.length; i++) {
        if (form.elements[i].name == element_name && form.elements[i].disabled == false) {
            form.elements[i].checked = value;
        }
    }
}

function SelectAllOrNoneByCheckbox(form, element_name, control)
{
    SelectChecked(form, element_name, control.checked);
}

function getLoginCookieValue()
{
    var c = document.cookie;
    var idx = c.indexOf('login=');
    if ( idx == -1) return "";
    idx += 'login='.length;
    var end = c.indexOf(';',idx);
    if ( end == -1) end = c.length;
    return c.substring(idx,end);
}

function loader()
{
     var username = getLoginCookieValue();
     if (username.length > 0) {
         document.login_noop.un_noop.value = username;
         document.login.un.value = username;
         document.login.pw.focus();
     } else {
         document.login_noop.un_noop.focus();
     }
     document.login.width.value=screen.width;
     document.login.height.value=screen.height;
}

    function handleSelectAllNoneCheckboxClick(chkbox, children) {
        for (var i = 0; i < children.length; i++) {
            var child = document.getElementById(children[i]);
            if (child) {
                child.checked = chkbox.checked;
            }
        }
    }

    function getObjX(obj){
        var x = 0;
        var offset = obj;
        while (offset != null){
            x += offset.offsetLeft;
            offset = offset.offsetParent;
        }
        return x;
    }

    function getObjY(obj){
        var y = 0;
        var offset = obj;
        while (offset != null){
            y += offset.offsetTop;
            offset = offset.offsetParent;
        }
        return y;
    }

    /**
     * Get the object's offset relative to the container that it's offset against,
     * that is, the nearest parent that has position relative or absolute
     */
    function getLocalOffset(offset, direction){
        var y = offset['offset' + direction];
        var div;
        try {
            div = offset.offsetParent;
        } catch(ex) {
            // with dhtml actions that change DOM IE may throw unspecified error
            // when checking offsetParent property
            return y;
        }
        while (div && getCurrentStyle(div, 'position') == 'static'){
            y += div['offset' + direction];
            try {
                div = div.offsetParent;
            } catch(ex) {
            // with dhtml actions that change DOM IE may throw unspecified error
            // when checking offsetParent property
            return y;
            }
        }
        return y;
    }

    function getLocalOffsetTop(offset){
        return getLocalOffset(offset, 'Top');
    }

    function getLocalOffsetLeft(offset){
        return getLocalOffset(offset, 'Left');
    }

    function getScrollX(){
        if (window.pageXOffset) return window.pageXOffset;
        if (document.documentElement && document.documentElement.scrollLeft) return  document.documentElement.scrollLeft;
        if (document.body.scrollHeight) return document.body.scrollLeft;
    }
    function getScrollY(){
        if (window.pageYOffset) return window.pageYOffset;
        if (document.documentElement && document.documentElement.scrollTop) return  document.documentElement.scrollTop;
        if (document.body.scrollWidth) return document.body.scrollTop;
    }
    function getMouseX(evt) {
        if (evt.pageX) return evt.pageX;
        return getScrollX() + evt.clientX;
    }
    function getMouseY(evt) {
        if (evt.pageY) return evt.pageY;
        return getScrollY() + evt.clientY;
    }
    function getSrcElement(evt) {
        evt = getEvent(evt);
        if (evt.srcElement) return evt.srcElement;
        return evt.currentTarget;
    }
    function ltrim(s) {
        return s.replace( /^\s*/, "" );
    }

    function rtrim(s) {
        return s.replace( /\s*$/, "" );
    }

    function trim(s){
        return rtrim(ltrim(s));
    }

    function escapeHTML(v) {
        if (v && v.replace){
            v = v.replace(/&/g, '\&amp;');
            v = v.replace(/</g, '&lt;');
            v = v.replace(/>/g, '&gt;');
        }
        return v;
    }
    function unescapeHTML(v) {
        if (v && v.replace){
            v = v.replace(/\&amp;/g, '&');
            v = v.replace(/&lt;/g, '<');
            v = v.replace(/&gt;/g, '>');
        }
        return v;
    }

    function unescapeJsInHtml(v) {
        if (v && v.replace){
            v = v.replace(/\\\\/g, '\\');
            v = v.replace(/\\'/g, "'");
            v = v.replace(/\\n/g, '\n');
            v = v.replace(/&quot;/g, '"');
        }
        return v;
    }

    function unescapeXML(v) {
        if (v && v.replace){
            v = v.replace(/\&amp;/g, '&');
            v = v.replace(/&lt;/g, '<');
            v = v.replace(/&gt;/g, '>');
            v = v.replace(/&quot;/g, '"');
            v = v.replace(/&apos;/g, "'");
        }
        return v;
    }

    function isValidEmail(email,list) {
        if (!email) return false;
        email = email.toLowerCase();
        var components = email.split('@');
        if (components.length != 2) return false;
        if (components[1].indexOf('.') < 0) return false;
        if (list) {
            var items = list.split(',');
            for (var i = 0; i < items.length; i++) {
                var domain = items[i];
                if (components[1] == domain) return true;
                if ((components[1].indexOf(domain, components[1].length - domain.length) > 0) &&
                    (components[1].charAt(components[1].length - domain.length - 1) == '.')) return true;
            }
            return false;
        }
        return true;
    }

    function setCookie(name, value, expires, path) {
        document.cookie= name + '=' + escape(value) +
            ((expires) ? '; expires=' + expires.toGMTString() : '') +
            ((path) ? '; path=' + path : '; path=/');
    }

    function getCookie(name) {
        var dc = document.cookie;
        var prefix = name + '=';
        var begin = dc.indexOf('; ' + prefix);
        if (begin == -1) {
            begin = dc.indexOf(prefix);
            if (begin != 0) return null;
        } else {
            begin += 2;
        }
        var end = document.cookie.indexOf(';', begin);
        if (end == -1) {
            end = dc.length;
        }
        return unescape(dc.substring(begin + prefix.length, end));
    }

    function deleteCookie(name, path) {
        if (getCookie(name)) {
            var exp = new Date( new Date().getTime() + (1000 * -10) );

            document.cookie = name + '=-deleted-' +
                ((path) ? '; path=' + path : '; path=/') +
                '; expires=' + exp.toGMTString();

        }
    }

    function addTwistCookie(cookieName, headerId, onOff) {
        var currentCookie = getCookie(cookieName);
        var cookieVal = headerId + ':' + (onOff ? '1' : '0') + ',' ;

        if (currentCookie) {
            var start = currentCookie.indexOf(headerId);
            while (start > -1) {
                var end = start + 18;
                var val = currentCookie.substring(start, end);
                currentCookie = currentCookie.substring(0, start) + currentCookie.substring(end, currentCookie.length);
                start = currentCookie.indexOf(headerId);
            }
            cookieVal = currentCookie + cookieVal;
        }
        setCookie(cookieName, cookieVal);
    }

    function handleTextAreaElementChange(textId, maxLength, remainingText, overText) {
        /* Used by TextAreaElement.  Relies on ids set there */
        var textArea = document.getElementById(textId);
        var counter = document.getElementById(textId + '_counter');

        if (!textArea || !counter) return maxLength;

        var valueLength = textArea.value.length;
        if (valueLength > 0 && !(isIE || isIE5)) {
            var lines = textArea.value.match(/\n/g);
            if (lines) valueLength += lines.length;
        }
        var remaining = maxLength - valueLength;

        if (remaining < 0) {
          counter.parentNode.className = "textCounterMiddle over";
          counter.innerHTML = (-1 * remaining) + " " + overText;
        } else if (remaining < 50) {
          counter.parentNode.className = "textCounterMiddle warn";
          counter.innerHTML = remaining + " " + remainingText;
        } else {
          counter.parentNode.className = "textCounterMiddle";
        }
        return remaining;
    }

/**
 *
 * Reports
 *
 */

// Used by filter lookup widgets to back fill the selected values
var filterLookupValueElem;

// Posts to load the filter lookup widget into a new window
// The GET is only used by workflow in setting up rule criteria.
function openFilterLookupWindow(formName, lookupUrl, fieldSelectName, valueElemName) {
    filterLookupValueElem = valueElemName;
    var fieldSelect = document.getElementById(fieldSelectName);
    var field = (typeof fieldSelect.selectedIndex == "number") ? fieldSelect.options[fieldSelect.selectedIndex] : fieldSelect;
    if ((formName != null) || (lookupUrl == null)) {
        var reportForm = document.getElementById(formName);

        // save state
        var savedFormAction = reportForm.action;
        var savedFormTarget = reportForm.target;
        var savedLookupValue = reportForm.lookup.value;

        if (lookupUrl != null) reportForm.action = lookupUrl;
        reportForm.target = 'filter_lookup';
        reportForm.lookup.value = field.value;
        reportForm.submit();

        // restore state
        reportForm.action = savedFormAction;
        reportForm.target = savedFormTarget;
        reportForm.lookup.value = savedLookupValue;
    } else {
        var junctionChar = lookupUrl.indexOf('?') >= 0 ? '&' : '?';
        curPopupWindow.location.href = lookupUrl + junctionChar + 'lookup=' + field.value + '&workflow=1';
    }
}


// popupRequest: 'validate', 'new', 'edit', 0+= edit formula index
function submitCalcAgg(popupRequest, iFormula) {
    var reportForm = document.report;
    if (!reportForm) reportForm = opener.document.report;
    reportForm.target = 'aggcalc_popup';
    reportForm.calcagg_request.value = popupRequest;
    reportForm.calcagg_index.value = iFormula;

    // Copy field values between wizard and popup
    if (popupRequest == 'new') {
        clearCalcAgg(reportForm, "_v");
    } else if (popupRequest == 'edit') {
        copyCalcaggParams(reportForm, iFormula, reportForm, "_v");
    } else if (popupRequest == 'done' || popupRequest == 'validate') {
        var popupForm = document.getElementById('calcagg_form');
        copyCalcaggParams(popupForm, "_v", reportForm, "_v");
    }

    reportForm.nav.value = 'agg';
    reportForm.submit();

    reportForm.calcagg_request.value = '';
    reportForm.target = '';
}

// Copies validated formula from popup to parent
function finishValidCalcAgg(iFormula) {
    var reportForm = opener.document.getElementById('report');
    var popupForm = document.getElementById('calcagg_form');

    reportForm.calcagg_index.value = iFormula;

    // Update display
    copyCalcaggParams(popupForm, "_v", reportForm, iFormula);
    reportForm['calcagg_active_v'].value = popupForm['calcagg_name_v'].value;

    reportForm.nav.value = 'agg';
    reportForm.submit();

    self.close();
}

var calcagg_params = ['calcagg_label', 'calcagg_name', 'calcagg_formula', 'calcagg_type', 'calcagg_desc', 'calcagg_scale'];

function clearCalcAgg(form, suffix) {
    for(var param in calcagg_params) {
        form[calcagg_params[param] + suffix].value = '';
    }
}

function deleteCalcAgg(iFormula) {
    var reportForm = document.getElementById('report');
    clearCalcAgg(reportForm, iFormula);
    reportForm.nav.value = 'agg';
    reportForm.submit();
}

function copyCalcaggParams(srcForm, srcSuffix, destForm, destSuffix) {
    for(var param in calcagg_params) {
        destForm[calcagg_params[param] + destSuffix].value = srcForm[calcagg_params[param] + srcSuffix].value;
    }
}

function getIframeContents(iFrame) {
    var document = iFrame.contentDocument || iFrame.contentWindow.document;
    return document.body.innerHTML;
}

function adjustIFrameSize(iFrame) {
    if (iFrame) {
        var bodyObj;
        var h = 0;
        var newHeight;
        if(iFrame.contentDocument) {
            newHeight = iFrame.contentDocument.body.offsetHeight;
        } else {
            if (document.frames && document.frames(iFrame.id)) {
                bodyObj = document.frames(iFrame.id).document.body;
            } else {
                bodyObj = iFrame.document.body
            }
            newHeight = (bodyObj.children.length <= 0) ? 0 : bodyObj.scrollHeight;
        }
        // Only resize if the difference is more than 15.
        var delta = iFrame.height - newHeight;
        if (delta < 0) delta = -delta;
        if (delta > 15) iFrame.height = newHeight;
    }
}

function showTextStateField(textFieldName, picklistFieldName) {
    textFieldName.style.display='';
    picklistFieldName.style.display='none';
}

function showPicklistStateField(stateList, textFieldName, picklistFieldName) {
    var stateValueList = stateList[0];
    var stateDisplayList = stateList[1];
    picklistFieldName.options.length=1
    for(i=0;i<stateValueList.length;i++) {
        picklistFieldName.options[i+1]= new Option(stateValueList[i],stateDisplayList[i]);
    }
    textFieldName.style.display='none';
    picklistFieldName.style.display='';
}

function showStateListForCountry(value, countryStateMap, textFieldName, picklistFieldName) {
    var stateList = countryStateMap[value];
    textFieldName.value='';
    if (stateList) {
        showPicklistStateField(stateList, textFieldName, picklistFieldName);
    } else {
        showTextStateField(textFieldName, picklistFieldName);
    }
}

// resize IMG to fit into the given height/width.
// Only used for logos
function scaleImage(imgObj, h, w) {
    //sometimes this function will be called before the image width is available (ie7) W-740808
    if(XBrowser.userAgent.isIE7){
        if(imgObj.width === 0){
            setTimeout(function(){
                scaleImage(imgObj, h, w);
            }, 10);
            return;
        }
    }

    // try to fit to the height first
    var x = imgObj.width * h / imgObj.height;
    var y = h;

    if (x > w) { // too wide. adjust to the max width
        x = w;
        y = imgObj.height * w / imgObj.width;
    }
    // scale only if the given image is bigger than the frame
    if (x < imgObj.width || y < imgObj.height) {
        imgObj.width = x;
        imgObj.height = y;
    }
    if(XBrowser.userAgent.isIE7){ //see comment at beginning of function
        imgObj.style.visibility = "visible";
    }
}

// refresh the current wizard page, possibly with different POST/GET values
// 'stageForm' and 'goRefresh' are hard-coded to match the values in Wizards
function refreshWizardPage(getValues) {
    var goRefreshMarker = 'goRefresh';
    var goRefreshElem = document.getElementById('goRefresh');
    // Ignore any refresh requests beyond the first
    if (goRefreshElem.value == goRefreshMarker) {
        return;
    }

    // simulate submit from "goRefresh" button
    goRefreshElem.value = goRefreshMarker;
    var form = document.getElementById('stageForm');

    // tack on the GET values
    form.action += getValues;
    form.submit();
}

function getOffsetLeft(e) {
  if (!e){
    return 0;
  }
  var left = e.offsetLeft;
  while (e.offsetParent){
    e = e.offsetParent;
    left += e.offsetLeft;
  }
  return left;
}

function getWindowWidth(){
  if (typeof window.innerWidth == 'number'){
    //Netscape/Moz
    return window.innerWidth;
  } else if (document.documentElement && (document.documentElement.clientWidth)){
    //IE 6+ in Standards mode
    return document.documentElement.clientWidth;
  } else if (document.body && document.body.clientWidth){
    //IE in quirks mode
    return document.body.clientWidth;
  }
}

function getWindowHeight(){
  if (typeof window.innerHeight == 'number'){
    //Netscape/Moz
    return window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientHeight)){
    //IE 6+ in Standards mode
    return document.documentElement.clientHeight;
  } else if (document.body && document.body.clientHeight){
    //IE in quirks mode
    return document.body.clientHeight;
  }
}

function getScrollTop(){
    if (self.pageYOffset) {
        // all except Explorer
        return self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollTop){
        // Explorer 6 Strict
        return document.documentElement.scrollTop;
    }
    else if (document.body){
        // all other Explorers
        return document.body.scrollTop;
    }
}

function getScrollLeft(){
    if (self.pageXOffset) {
        // all except Explorer
        return self.pageYOffset;
    }
    else if (document.documentElement && document.documentElement.scrollLeft){
        // Explorer 6 Strict
        return document.documentElement.scrollLeft;
    }
    else if (document.body){
        // all other Explorers
        return document.body.scrollLeft;
    }
}

function hasStyleClass(elem, clazzName) {
    var n = ' ' + elem.className + ' ';
    return (n.indexOf(' ' + clazzName + ' ') >= 0);
}

function addStyleClass(elem, clazzName) {
    var n = ' ' + elem.className + ' ';
    if (n.indexOf(' ' + clazzName + ' ') < 0) {
        var append = (elem.className && elem.className.length > 0) ? ' ' + clazzName : clazzName;
        elem.className += append;
    }
}

function delStyleClass(elem, clazzName) {
    var n = ' ' + elem.className + ' ';

    var len = clazzName.length;
    var start = n.indexOf(' ' + clazzName + ' ');
    if (start >= 0) {
        var end = start + len + 1;
        elem.className = trim(n.substring(0, start) + n.substring(end, n.length));
        return;
    }
}


function hiOn(row){
    if(row!=null) {
        addStyleClass(row, 'highlight');
    }
}

function hiOff(row){
    if(row!=null) {
        delStyleClass(row, 'highlight');
    }
}

function toggleVis(element){
    element.style.visibility = element.style.visibility == 'hidden' ? 'visible' : 'hidden';
}

function toggleVisWithPositionAbsolute(elementId){
    var element = document.getElementById(elementId);
    if(!element){return;}
    toggleVis(element);
    element.style.position = element.style.position == 'absolute' ? 'static' : 'absolute';
}

function setVis(element, on){
    element.style.visibility = on ? 'visible' : 'hidden';
}

function toggleVisWIframe(element){
    var iframe = document.getElementById(element.id + '_iframe');
    if (typeof iframe != 'undefined') {
        var show = (element.style.visibility == 'hidden');
        if (show){
            iframe.style.left = element.offsetLeft;
            if (iframe.style.left == element.offsetLeft + 'px'){
                //Mozilla doesn't support setting style properties on an
                //iframe, apparently, but fortunately this doesn't matter because
                //we don't need the iframe in mozilla.  If the line above didn't work,
                //just don't show the iframe.
                iframe.style.top = element.offsetTop;
                iframe.style.width = element.offsetWidth;
                iframe.style.height = element.offsetHeight;
                iframe.style.display = 'block';
            }
        } else {
            iframe.style.display = 'none';
        }
    }
    toggleVis(element);
}

// usage formatMessage("{1}... {0}...", arg1, args2,...);
function formatMessage(msg) {
    var parameters = arguments;
    // form a closure
    var f = function(str,match,offset,all) {
        return parameters[parseInt(match)+1];
    }
    var res = msg.replace(/\{([0-9]*)\}/g,f);
    return res;
}

function highlightToc(section, topic ){

    if (!(top.frames.frames["body"] && top.frames["body"].frames["toc"])) return;
    var fullyLoaded = top.frames["body"].frames["toc"].document.getElementById("fullyLoadedDiv");
    if (fullyLoaded){
        top.frames["body"].frames["toc"].HTMLTreeNode.prototype.openHTMLTree(section,topic);
    }
}

//used in help naviagation to highlight correct topic when switching from index to content
function loadToc(url ){

        var topic = top.frames["body"].frames["content"].location.href;
        topic = topic.substring(topic.lastIndexOf('/')+1,topic.indexOf('.htm'));
        top.frames["body"].frames["toc"].location.href=url+"?item="+topic+"&section=none";
}


// cloneNode doesn't seem to be very reliable, and doesn't work at all for copying across documents
// note: this copies the id attribute of the element and any children, so if you're duplicating
// rather than replacing, the id(s) must be changed after copying.
function deepCopy(elem, ownerDoc) {
    var copy = ownerDoc.createElement(elem.tagName);

    if ((typeof elem.attributes != "undefined") && (elem.attributes != null)) {
        for (var at = 0; at < elem.attributes.length; at++) {
            copy.setAttribute(elem.attributes[at].name, elem.attributes[at].value);
        }
    }

    if (elem.nodeValue != null) {
        copy.appendChild(ownerDoc.createTextNode(elem.nodeValue));
    }

    if ((typeof elem.childNodes != "undefined") && (elem.childNodes != null)) {
        for (var el = 0; el < elem.childNodes.length; el++) {
            copy.appendChild(deepCopy(elem.childNodes[el], ownerDoc));
        }
    }

    return copy;
}

/**
 * Use this function to "borrow" a form on the page to perform a submit to somewhere
 * else. This function will swap the existing action and target of the specified form,
 * submit, and then restore the original values.
 *
 * Use null for newAction or newTarget if you do not want to replace the existing
 * values.
 */
function borrowForm(formId, newAction, newTarget) {
    var form = document.getElementById(formId);

    var savedAction = form.action;
    var savedTarget = form.target;

    if (newAction != null) form.action = newAction;
    if (newTarget != null) form.target = newTarget;

    /*
     * Directly calling submit() does not trigger the onSubmit attribute of a form, so
     * it needs to be called directly before we submit.
     */
    if (form.onsubmit) {form.onsubmit();}

    form.submit();

    form.action = savedAction;
    form.target = savedTarget;
}

/* These functions are part of DetailElement */
function toggleRow (id, on){
    var elem = document.getElementById(id);
    if (elem==null) return;
    var parentRow = elem;
    while (parentRow!=null && parentRow.tagName != 'TR') { parentRow = parentRow.parentNode;}
    toggleDisplay(parentRow,on);
}

function setRowVis (id, on){
    var elem = document.getElementById(id);
    if (elem==null) return;
    var parentRow = elem;
    while (parentRow!=null && parentRow.tagName != 'TR') { parentRow = parentRow.parentNode;}
    if (parentRow == null) return;
    setVis(parentRow, on);
}

function toggleDisplay(elem, on) {
    if (isIE && !isOpera) {
        if (on) {
             elem.style.display = 'block';
        } else {
            elem.style.display = 'none';
        }
    } else {
         if (on) {
             elem.style.display = 'table-row';
        } else {
            elem.style.display = 'none';
        }
    }
}

/**
 * Toggle displaying given element. If element is invisible make it visible
 * with given display type. If Element is visible make it invisible.
 * If animate is true, will use expand/collapse animation when bringing
 * element in/out of view.
 */
function toggleDisplayWithDisplayType(idOfElement, displayType, animate){
    var element = document.getElementById(idOfElement);
    if(!element){
        return;
    }
    if(!displayType){
        displayType = "block";
    }
    if (!animate) {
        element.style.display = element.style.display == 'none' ? displayType : 'none';
        return;
    }

    if (element.style.display == 'none') {
        Animation.rollIn(element, function() {element.style.display = displayType;} );
        return;
    }
    Animation.rollOut(element);
}

function getElementsByNameCS(name){
    var elements = document.getElementsByName(name);
    var ret = [];
    for (var i = 0; i < elements.length; i++){
        if (elements[i].name == name){
            ret.push(elements[i]);
        }
    }
    return ret;
}

// retrieve a DOM element by id honoring case
function getElementByIdCS(id) {
    return getElementByIdCSWithDoc(document, id);
}


function getElementByIdCSWithDoc(doc, id) {
    var el = doc.getElementById(id);
    if(el == null || el.id == id) return el;

    if (doc.all) {
        return doc.all[id];
    }
    return null;
}

function getElementsByClassName(strClassName, oElm /* = document.body */, strTagName/* = '*' */){
    if (!strTagName) strTagName = "*";
    if (!oElm) oElm = document.body;

    //document.all is *much* faster in IE than getElementsByTagName("*"), unfortunately.
    var arrElements = (strTagName == "*" && oElm == document.body && document.all)? document.all : oElm.getElementsByTagName(strTagName);
    var arrReturnElements = new Array();
    strClassName = strClassName.replace(/\-/g, "\\-");
    var oRegExp = new RegExp("\\b" + strClassName + "\\b");
    var len = arrElements.length;
    for(var i=0; i<len; i++){
        if(oRegExp.test(arrElements[i].className)){
            arrReturnElements.push(arrElements[i]);
        }
    }
    return arrReturnElements;
}


/*
 * IE has a problem with circular references when using OO-style JS and closures for event
 * handlers.  If we call detachEvent for every addEvent on window.onunload, we can make it
 * much better.  See cleanupEvents()
 */

function EventData(e, type, fn, useCap){
  this.element = e;
  this.type = type;
  this.handler = fn;
  this.useCapture = useCap;
}

var eventRegistry;

// attach an event
var addEvent = function() {
    if (window.addEventListener) {
        return function(obj, evType, fn, useCapture) {
            obj.addEventListener(evType, fn, useCapture);
            if (!eventRegistry){
                eventRegistry = [];
                window.addEventListener('unload', cleanupEvents, false);
            }
            eventRegistry.push(new EventData(obj, evType, fn, useCapture));
        };
    } else if (window.attachEvent) {
        return function(obj, evType, fn, useCapture) {
            var r = obj.attachEvent("on" + evType, fn);
            if (!eventRegistry){
                eventRegistry = [];
                window.attachEvent("onunload", cleanupEvents);
            }
            eventRegistry.push(new EventData(obj, evType, fn));
            return r;
        };
    }
    return function() { return null; };
}();

// remove an event, no memory cleanup
var removeEvent = function() {
    if (window.removeEventListener) {
        return function(obj, evType, fn, useCapture) {
            obj.removeEventListener(evType, fn, useCapture);
        };
    } else if (window.detachEvent) {
        return function(obj, evType, fn, useCapture) {
            obj.detachEvent('on' + evType, fn);
        };
    }
    return function() { return null; };
}();

// removes all events and cleans up after them
function cleanupEvents() {
    if (eventRegistry) {
        for (var i = 0; i < eventRegistry.length; i++) {
            var evt = eventRegistry[i];
            removeEvent(evt.element, evt.type, evt.handler, evt.useCapture);
        }
        // unlink circular refrences so they can be GC'd
        eventRegistry = null;
        removeEvent(window, "unload", cleanupEvents, false);
    }
}

function mouseExited(evt, div){
//	debugger;
    var to = getEventToElement(evt);
    while (to && to != document.body){
        if (to == div) return false;
        to = to.parentNode;
    }
    return true;
}

function getEvent(e){
    return e || window.event;
}

function getEventTarget(e){
    return (window.event) ? e.srcElement : e.target;
}

function getEventToElement(e){
    return (e.relatedTarget) ? e.relatedTarget : e.toElement;
}

function eventCancelBubble(e){
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation();
}

/* Turn javaScriptProperties into java-script-properties, useful for CSS stuff*/
function dashify(str){
    return str.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}


function getCurrentStyle(element, styleProp){
    var retVal;
    if (element.currentStyle){
        //IE
        retVal = element.currentStyle[styleProp];
    } else if (document.defaultView && document.defaultView.getComputedStyle) {
        //Mozilla
        retVal = document.defaultView.getComputedStyle(element,null).getPropertyValue(dashify(styleProp));
    } else {
        //Safari :(
        retVal = null;
    }
    return retVal;
}

function copyAddr(a1Street, a1City, a1Zip, a1Country, a1State, a2Street, a2City, a2Zip, a2Country, a2State, a1StateShown, a2StateShown) {
    document.getElementById(a2Street).value = document.getElementById(a1Street).value;
    document.getElementById(a2City).value = document.getElementById(a1City).value;
    document.getElementById(a2Zip).value = document.getElementById(a1Zip).value;
    document.getElementById(a2Country).value = document.getElementById(a1Country).value;
    if (a1StateShown && a2StateShown) {
        document.getElementById(a2State).value = document.getElementById(a1State).value;
    }
}


function showMoreList(listUrl, listQS, listId) {
    if (sfdcPage.getRelatedListById) {
      sfdcPage.getRelatedListById(listId).showMoreList(listUrl, listQS);
      } else {
      callRelatedListAction(null, listUrl, listQS, listId);
      }
}

function callRelatedListAction(actionUrl, listUrl, listQS, listId, resizeSidebar, onSuccessCallback) {
    if (sfdcPage.getRelatedListById) {
          sfdcPage.getRelatedListById(listId).callRelatedListAction(actionUrl, listUrl, listQS, null, null, resizeSidebar, onSuccessCallback);
    } else {
    function processNewList(newDoc) {
        if (!newDoc) {
            return;
        }

        // if returned page is error page - load that page directly that allows to redirect to login page
        if(window.sfdcPage && window.sfdcPage.hasNoRelatedList && window.sfdcPage.hasNoRelatedList(newDoc, listId)){
            // remove empty page header param
            listUrl = removeParam(listUrl, DynamicContent.pCOOKIE_PARAM);
            window.location = listUrl;
        }

        // ignore request that was canceled by user
        if(window.sfdcPage && window.sfdcPage.checkActionCanceled && window.sfdcPage.checkActionCanceled(newDoc, listId)){
            return;
        }

        var newList = getElementByIdCSWithDoc(newDoc, listId);
        var oldList = getElementByIdCSWithDoc(document, listId);
        if (!newList || !oldList) {
            return;
        }
        var newHTML = newList.innerHTML;

        // special code to handle IE rendering bug with adding a space before the relatedList header H3
        var split = newHTML.toLowerCase().indexOf('\n<h3');
        if (split > -1) {
            oldList.innerHTML = newHTML.substring(0, split-1) + newHTML.substring(split+1, newHTML.length);
        } else {
            oldList.innerHTML = newHTML;
        }

        // need to evaluate scripts on the page
        if(window.sfdcPage && window.sfdcPage.evalScripts){
            window.sfdcPage.evalScripts(oldList);
        }

        if(resizeSidebar){
            if(Sidebar.prototype.theSidebar) {
                Sidebar.prototype.theSidebar.sizeToBody();
                Sidebar.prototype.theSidebar.sizeBodyToSidebarNoCheck();
            }
        }
    }
    makeActionRequest(actionUrl, listUrl, listQS, processNewList);
  }
}

function makeAjaxRequest(myUrl, handler)
{
    if(window.XMLHttpRequest) {
        xmlhttp = new XMLHttpRequest(); // Gecko (Firefox, Moz), KHTML (Konqueror, Safari), Opera
    } else if(window.ActiveXObject) {
        xmlhttp = new ActiveXObject("MSXML2.XMLHTTP"); // Internet Explorer
    } else {
        return false;
    }
    xmlhttp.open("GET", myUrl, true); // Open a connection. Replace GET with HEAD in order to do a HEAD request.

    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && handler) { // Wait until everything is fetched!
            handler(xmlhttp.responseText);
        }
    }
    xmlhttp.send(null); // send() is used to initiate the transfer. No actual data have to be sent in this case.
}

function assureInt(num) {
    var x;
    return isNaN(x=parseInt(num))? 0 : x;
}

function setElementsEnabledBasedOnCheckbox(checkboxId, elementIds) {
    function setDisplay(checkbox, elementId) {
        var element = document.getElementById(elementId);
        if (element) {
            if (checkbox.checked) {
                element.style.display = '';
            } else {
                element.style.display = 'none';
            }
        }
    }
    var checkbox = document.getElementById(checkboxId);
    if (checkbox != null && elementIds != null) {
        for (var i = 0; i < elementIds.length; i++) {
            setDisplay(checkbox, elementIds[i]);
        }
    }
}

/**
 * Register CTI ClickToDial phone elements
 */
function registerClickToDial(span, isEnabled) {
    var theWindow;
    // check if we're in desktop mode
    if (self.getAccessibleParentWindow) {
        theWindow = getAccessibleParentWindow(self);
    } else {
        theWindow = self;
    }

    // make sure this is a softphone-enabled page
    if (theWindow && theWindow.registerClickToDialEnabled) {
        if (isEnabled) {
            theWindow.registerClickToDialEnabled(span);
        } else {
            theWindow.registerClickToDialDisabled(span);
        }
    }
}


/**
 * Strip the protocol and domain from a URL.
 */
function stripDomainFromUrl(url) {
    var protocolDelim = "://";
    var domainDelim = "/";
    var start = url.indexOf(protocolDelim);
    if (-1 != start) {
        // Strip protocol
        url = url.substring(start + protocolDelim.length);
        // Strip domain, leaving the slash
        url = url.substring(url.indexOf(domainDelim));
    }
    return url;
}

/*
 * This is a HACK.  The page gets the focus before bodyOnFocus is
 * defined at the bottom of the page by displayBodyJavascript.
 * This will fix that.  For now.
 *
 * --EMM
 */
function bodyOnFocus() {}


function showDebugLog(show, showExecute) {
  if (show) {
      setCookie('showDebugLog', 'PROFILING');
      setCookie('showExecute', showExecute);

      XBrowser.createDynamicScript('/apexdebug/log4javascript.js', function() {
          XBrowser.createDynamicScript('/apexdebug/apexdebuglog.js', function() {initSystemLogUi(true);})
      });

  } else {
      deleteCookie('showDebugLog');
      if (!showExecute) {
          deleteCookie('showExecute');
      }
  }
}

var debugLogWindow;

function getDebugLogWindow() {
    return (debugLogWindow && !debugLogWindow.closed) ? debugLogWindow : null;
}

function setDebugLogWindow(win) {
    debugLogWindow = win;
}

// Make sure our cookie does not exist if the window does not exist. See AppBodyFooter.java.
function checkDebugLogWindowExists() {
    var exists = debugLogWindow && debugLogWindow.open && !debugLogWindow.closed;
    if (!exists && getCookie('showDebugLog')) {
        deleteCookie('showDebugLog');
        deleteCookie('showExecute');
    }

    return exists;
}
