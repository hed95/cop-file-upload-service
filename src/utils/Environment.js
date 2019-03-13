class Environment {
  static isNotProd(nodeEnv) {
    return ['dev', 'test'].includes(nodeEnv);
  }

  static isProd(nodeEnv) {
    return !this.isNotProd(nodeEnv);
  }
}

export default Environment;
