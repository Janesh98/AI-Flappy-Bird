class NeuralNetwork {

    constructor(input, hidden, output, agent=null) {
        this.input_nodes = input;
        this.hidden_nodes = hidden;
        this.output_nodes = output;

        if (agent) {
            this.agent = agent;
        } else {
            this.agent = this.createAgent();
        }
    }

    dispose() {
        return this.agent.dispose();
    }

    // not in use as crossover made performance 3x worse
    crossover(parentA) {
        tf.tidy(() => {
            const weights = this.agent.getWeights();
            const weightsA = parentA.brain.agent.getWeights();
            const mutatedWeights = [];
            for (let i = 0; i < weights.length; i++) {
              let tensor = weights[i];
              let shape = weights[i].shape;
              let values = tensor.dataSync().slice();
              let valuesA = weightsA[i].dataSync().slice();

              let crosspoint = valuesA.length / 2;
              // take first half of one agents weights and the second half
              // of another tensors weights and combine them into one
              for (let j = crosspoint; j < values.length; j++) {
                let w = valuesA[j];
                values[j] = w;
              }
              let newTensor = tf.tensor(values, shape);
              mutatedWeights[i] = newTensor;
            }
            this.agent.setWeights(mutatedWeights);
        });
    }

    mutate(rate) {
        tf.tidy(() => {
          const weights = this.agent.getWeights();
          const mutatedWeights = [];
          for (let i = 0; i < weights.length; i++) {
            let tensor = weights[i];
            let shape = weights[i].shape;
            let values = tensor.dataSync().slice();
            for (let j = 0; j < values.length; j++) {
              if (random(1) < rate) {
                let w = values[j];
                values[j] = w + randomGaussian();
              }
            }
            let newTensor = tf.tensor(values, shape);
            mutatedWeights[i] = newTensor;
          }
          this.agent.setWeights(mutatedWeights);
        });
      }

    copy() {
        return tf.tidy(() => {
          const modelCopy = this.createAgent();
          const weights = this.agent.getWeights();
          const weightCopies = [];
          for (let i = 0; i < weights.length; i++) {
            weightCopies[i] = weights[i].clone();
          }
          modelCopy.setWeights(weightCopies);
          return new NeuralNetwork(
            this.input_nodes,
            this.hidden_nodes,
            this.output_nodes,
            modelCopy
          );
        });
      }

    createAgent() {
        const model = tf.sequential();

        // First layer must have a defined input shape
        model.add(tf.layers.dense({
            inputShape: [this.input_nodes],
            units: this.hidden_nodes,
            activation: 'sigmoid'
        }));
        // Afterwards, TF.js does automatic shape inference.
        model.add(tf.layers.dense({
            units: this.output_nodes,
            activation: 'softmax'
        }));

        return model;
    }

    predict(inputs) {
        return tf.tidy(() => {
            const tensor = tf.tensor2d([inputs]);
            const outputs = this.agent.predict(tensor);
            return outputs.dataSync();
        });
    }

}