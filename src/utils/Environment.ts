class Environment {
  public static isNotProd(nodeEnv?: string): boolean {
    return ['dev', 'test'].includes(nodeEnv || 'prod');
  }

  public static isProd(nodeEnv?: string): boolean {
    return !this.isNotProd(nodeEnv || 'prod');
  }
}

export default Environment;
