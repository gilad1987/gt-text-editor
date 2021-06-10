import {GtDomUtil} from "./GtDomUtil";

export class GtEditor extends GtDomUtil{
    
    constructor(){
        super();
        this.editorElement = null;
        this.functionalityCollection = null;
        this.templateStateData = null;
        this.currentStyle = {};
        
    }

    initCurrentStyle(){
        let stateName,
            state,
            stateData,
            states = this.getStates();

        for(stateName in states){
            state = states[stateName];
            stateData = this.getStateData(state);
            this.currentStyle[stateData.style.key] = {
                key:stateData.style.key,
                value: stateData.style.values[ state.getCurrentIndex() ] ,
                state:state
            };
        }

    }

    getStateData(state){
        return this.templateStateData[stateName];
    }
    
    setStates(functionalityCollection){
        this.functionalityCollection = functionalityCollection;
        this.subscribeToStates();
    }
    
    getStates(){
        return this.functionalityCollection.getAllStates();
    }
    
    getState(stateName){
        return this.getStates()[stateName];
    }

    getStateData(state){
        return this.templateStateData[state.stateName];
    }
    
    

    subscribeToStates(){
        let stateName,state,states;
        states = this.getStates();
        for(stateName in states){

            if(!states.hasOwnProperty(stateName)){
                return false;
            }

            state = states[stateName];
            
            if(state.isOn()){
                this.updateCurrentStyleByState(state);
            }
            
            state.subscribe(this.onStateChange, this);
        }
    }

    updateCurrentStyleByState(state){
        let stateData = this.templateStateData[state.stateName];
        this.currentStyle[stateData.style.key].value = stateData.style.values[ state.getCurrentIndex() ];
        return this;
    }

    /**
     *
     * @param node
     * @returns {Array}
     */
    compareCurrentStyle(node){
        let style,
            elementToCompare,
            stylesNotEqual;

        stylesNotEqual = [];

        for(style in this.currentStyle){
            elementToCompare = node;

            if(style=='text-align'){
                elementToCompare = node.closest('p');
                if(!elementToCompare){
                    continue;
                }
            }

            if(!this.hasStyle(elementToCompare,style,this.currentStyle[style].value)){
                stylesNotEqual.push({
                    element : elementToCompare,
                    state: this.currentStyle[style].state,
                    style: style,
                    nodeStyleValue: this.getStyleValue(elementToCompare,style),
                    currentStyleValue: this.currentStyle[style].value
                });
            }
                

        }
        
        return stylesNotEqual;
    }

    onStateChange(state){
        console.log('Abstract Callback - GtEditor:onStateChange - no implement');
    }

    getCurrentStyle(state){
        return{
            key:this.currentStyle[state.stateName].key,
            value:this.currentStyle[state.stateName].value
        }
    }
}