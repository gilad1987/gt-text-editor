import { GtEvent } from './GtEvent';

/**
 * @date 8.7.2016
 * @author Gilad Takoni
 */
export default class GtState extends GtEvent {

    /**
     * @param {string} stateName
     * @param {boolean} enabled
     */
    constructor(stateName, enabled) {
        super();
        this.stateName = stateName;
        this.eventNameOnChangeValue = 'valueChange';
        this._isEnabled = [];
        this._currentIndex = 0;
        this.maxIndex = 0;
    }

    subscribe(handler, context) {
        this.on(this.eventNameOnChangeValue, handler, context, this);
        return this;
    }

    unSubscribe(handler) {
        this.off(this.eventNameOnChangeValue, handler);
        return this;
    }

    isOn() {
        return this._isOn;
    }

    isEnable() {
        return this._isEnabled.length == 0;
    }

    setOn(isOn) {
        this._isOn = !!isOn;
    }

    setEnabled(isEnabled, reason) {

        if (this._isEnabled[reason])
            return;

        var triggerEvent = (this.isEnabled());

        if (this._isEnabled[reason] = isEnabled)
            this.reasonCount--;
        else
            this.reasonCount++;

        if (triggerEvent) {
            this.trigger("isEnabledChanged", this);
        }
    }

    toggle() { }

    setCurrentIndex(index) {
        this._currentIndex = index;
        // let args = [this],
        //     argumentsLength = arguments.length;
        //
        // if(argumentsLength){
        //     let i=0;
        //     for(;i<argumentsLength;i++){
        //         args.push(arguments[i]);
        //     }
        // }
        //
        // let nextIndex = index;
        //
        // if(!nextIndex){
        //     nextIndex = this.currentIndex+1;
        //     if( nextIndex > this.maxIndex ){
        //         nextIndex = 0;
        //     }
        // }
        //
        // this.currentIndex = nextIndex;

        // this.trigger(this.eventNameOnChangeValue,args);
    }

    getCurrentIndex() {
        return this._currentIndex;
    }

    action() {
        let args = [this],
            argumentsLength = arguments.length;

        if (argumentsLength) {
            let i = 0;
            for (; i < argumentsLength; i++) {
                args.push(arguments[i]);
            }
        }

        this.trigger(this.eventNameOnChangeValue, args);
    }

    addObjection() {

    }
}