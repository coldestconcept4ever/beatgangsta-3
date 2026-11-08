import * as ort from 'onnxruntime-web';

/**
 * Neural Inference Engine wrapper using ONNX Runtime for local GPU acceleration.
 */
export class InferenceEngine {
  private session: ort.InferenceSession | null = null;
  private isInitialized = false;

  constructor(private modelPath: string) {}

  async initialize() {
    if (this.isInitialized) return;
    try {
      // Load the ONNX model from the public directory
      this.session = await ort.InferenceSession.create(this.modelPath, {
        executionProviders: ['webgpu', 'wasm'],
      });
      this.isInitialized = true;
      console.log(`[STEM-INF] Neural model loaded: ${this.modelPath}`);
    } catch (err) {
      console.error("[STEM-INF] Failed to load neural model:", err);
      throw err;
    }
  }

  /**
   * Performs neural inference on a mono AudioBuffer
   */
  async runInference(audioBuffer: AudioBuffer): Promise<Float32Array> {
    if (!this.session) await this.initialize();

    const data = audioBuffer.getChannelData(0);
    // Prepare Tensor (1, 1, samples)
    const tensor = new ort.Tensor('float32', data, [1, 1, data.length]);
    
    // Run Inference
    const results = await this.session!.run({ [this.session!.inputNames[0]]: tensor });
    const outputTensor = results[this.session!.outputNames[0]];

    return outputTensor.data as Float32Array;
  }
}
