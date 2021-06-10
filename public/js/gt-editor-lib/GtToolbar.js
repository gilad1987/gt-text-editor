import { GtEditor } from "./GtEditor";
import { GtSelection } from "./GtSelection";

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export default class GtToolbar extends GtEditor {

    /**
     * @param { GtFunctionalityCollection } functionalityCollection
     * @param {Element} [editorParentElement]
     * @param {Object} [templateStateData]
     */
    constructor(functionalityCollection, editorParentElement, templateStateData) {

        super();

        this.currentStyle = {};
        this.templateStateData = templateStateData;
        this.setStates(functionalityCollection);
        this.classNameButtonActive = 'active';
        this.wrapperElement = editorParentElement;

        /**
         * @type {GtSelection}
         */
        this.gtSelection = new GtSelection();

        this.initCurrentStyle();

        if (this.wrapperElement) {
            this.render(this.wrapperElement);
        }
    }

    /**
     * @desc Call when state's status changed.
     * @param {GtState} state
     * @param {string} eventName
     * @returns {GtToolbar}
     */
    onStateChange(state, eventName, button) {

        if (eventName == 'toolbar:stateValueChange') { // && startNode == endNode && endOffset - startOffset == 0
            this.gtSelection.restoreSelection(this.gtSelection.getCurrentRange());
        }

        this.updateToolBarElements(state, button);

        return this;
    }

    /**
     * @desc Update Element after state's status changed.
     * @param {GtState} state
     * @returns {GtToolbar}
     */
    updateToolBarElements(state, button) {

        let parent;
        this.updateCurrentStyleByState(state);

        parent = this.wrapperElement.querySelectorAll('[data-state-name="' + state.stateName + '"]')[0];

        if (!parent) {
            return this;
        }

        if (this.hasClass(parent, 'group')) {
            let activeButtons = parent.querySelectorAll('.Button.' + this.classNameButtonActive);
            button = button || parent.querySelectorAll('[data-selection-index="' + state.getCurrentIndex() + '"]')[0];
            this.removeClass(activeButtons, this.classNameButtonActive);
            this.addClass(button, this.classNameButtonActive);
        }

        if (this.hasClass(parent, 'toggle')) {
            button = button || parent.getElementsByClassName('Button')[0];
            this.toggleClass(button, this.classNameButtonActive);
        }

        if (this.hasClass(parent, 'list')) {
            let label = parent.querySelectorAll('span.label')[0];

            label.innerHTML = button ?
                button.innerHTML :
                this.getCurrentStyle(state).value;

            if (button) {
                this.toggleClass(parent, 'active');
            }
        }

        return this;
    }

    /**
     * @param {Element} editorParentElement
     * @param {Array} [groupStates]
     * @returns {GtToolbar}
     */
    render(editorParentElement, groupStates) {

        this.wrapperElement = editorParentElement;

        let group,
            len,
            currentStatesGroup,
            i = 0,
            toolbarElement = this.createNewNode('div', null, 'ToolBar');

        groupStates = groupStates ? groupStates : [this.getStates()];

        len = groupStates.length;
        for (; i < len; i++) {
            currentStatesGroup = groupStates[i];
            group = this.renderStates(currentStatesGroup);
            toolbarElement.appendChild(group);
        }

        this.wrapperElement.addEventListener('click', (event) => {
            this.onToolbarSelectionClick(event);
        });

        this.wrapperElement.appendChild(toolbarElement);
        return this;
    }

    renderStates(states) {
        let stateName,
            group = this.createNewNode('div', null, 'ButtonGroup');

        for (stateName in states) {
            if (states.hasOwnProperty(stateName)) {

                let state,
                    stateData,
                    i,
                    buttonsConfig,
                    buttonConfig,
                    selectionIndex,
                    buttonElement,
                    ul, li,
                    toolbarSelectionElement,
                    currentButtonConfig,
                    buttonClasses,
                    wrapperSelectionsClasses = [];

                state = states[stateName];
                stateData = this.templateStateData[stateName];
                i = 0;

                ul = this.createNewNode('ul');
                wrapperSelectionsClasses.push('gt-toolbar-selection-wrapper');

                if (!stateData) {
                    throw new Error('Invalid template state data for: ' + stateName);
                }

                buttonsConfig = stateData.buttons;
                buttonClasses = ['gt-toolbar-selection', 'Button'];
                wrapperSelectionsClasses.push(stateData.type);
                toolbarSelectionElement = this.createNewNode('div', null, wrapperSelectionsClasses, null, { 'stateName': state.stateName });

                if (stateData.type == 'group') {
                    buttonClasses.push('selection-group');
                }

                if (stateData.type == 'toggle') {
                    buttonClasses.push('selection-cycler');
                }

                if (stateData.type == 'list') {
                    buttonClasses.push('selection-item');
                    let opener = this.createNewNode('button', null, ['Button', 'label', 'selection-opener'], null, null, '<span class="label">' + stateData.label + '</span>');
                    let arrow = this.createNewNode('span', null, 'arrow', null, null, '<span class="icon"></span>');
                    opener.appendChild(arrow);
                    toolbarSelectionElement.appendChild(opener);
                }



                for (buttonConfig in buttonsConfig) {
                    currentButtonConfig = buttonsConfig[buttonConfig];
                    li = this.createNewNode('li');
                    selectionIndex = stateData.style.values.indexOf(buttonConfig);
                    buttonElement = this.createNewNode(currentButtonConfig.nodeName, null, buttonClasses, null, { 'selectionIndex': selectionIndex }, currentButtonConfig.icon, currentButtonConfig.elementAttrs);

                    li.appendChild(buttonElement);
                    ul.appendChild(li);
                }


                toolbarSelectionElement.appendChild(ul);
                group.appendChild(toolbarSelectionElement);

            }
        }

        return group;
    }

    onToolbarSelectionClick(event) {

        let button = event.target.closest('button');
        let parent,
            state,
            stateData,
            newIndex;

        if (!button) {
            return false;
        }

        if (this.hasClass(button, 'opener')) {
            return false;
        }

        parent = button.closest('.gt-toolbar-selection-wrapper');

        let stateName = parent.dataset['stateName'];

        if (!stateName) {
            return false;
        }

        state = this.getState(stateName);
        stateData = this.getStateData(state);

        if (!stateData) {
            return false;
        }

        if (this.hasClass(button, 'selection-opener')) {
            this.toggleClass(parent, 'active');
            return;
        }

        if (this.hasClass(button, 'selection-cycler')) {
            newIndex = state.getCurrentIndex() + 1;
            if (newIndex > stateData.style.values.length - 1) {
                newIndex = 0;
            }
        }

        if (this.hasClass(button, 'selection-group')) {
            newIndex = button.dataset['selectionIndex'];
        }

        if (this.hasClass(button, 'selection-item')) {
            newIndex = button.dataset['selectionIndex'];

        }

        if (newIndex == state.getCurrentIndex()) {
            return false;
        }


        state.setCurrentIndex(newIndex);
        state.action('toolbar:stateValueChange', button);
    }


}