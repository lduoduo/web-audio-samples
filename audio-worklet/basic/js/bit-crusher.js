/**
 * @class BitCrusher
 * @extends AudioWorkletProcessor
 *
 * This is an adaptation of: 
 * https://webaudio.github.io/web-audio-api/#the-bitcrusher-node
 */


registerProcessor('bit-crusher', class BitCrusher extends AudioWorkletProcessor {

  static get parameterDescriptors() {
    return [
      {name: 'bitDepth', defaultValue: 12, minValue: 1, maxValue: 16}, {
        name: 'frequencyReduction',
        defaultValue: 0.5,
        minValue: 0,
        maxValue: 1
      }
    ];
  }

  constructor(options) {
    super(options);
    this.phase_ = 0;
    this.lastSampleValue_ = 0;
  }

  process(input, output, parameters) {
    let inputChannelData = input.getChannelData(0);
    let outputChannelData = output.getChannelData(0);
    let bitDepth = parameters.bitDepth;
    let frequencyReduction = parameters.frequencyReduction;

    for (let i = 0; i < 128; ++i) {
      let step = Math.pow(0.5, bitDepth[i]);
      this.phase_ += frequencyReduction[i];
      if (this.phase_ >= 1.0) {
        this.phase_ -= 1.0;
        this.lastSampleValue_ =
            step * Math.floor(inputChannelData[i] / step + 0.5);
      }
      outputChannelData[i] = this.lastSampleValue_;
    }
  }

});
