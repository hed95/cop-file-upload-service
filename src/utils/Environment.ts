class Environment {
  public static isNotProd(nodeEnv: string = ''): boolean {
    return ['dev', 'test'].includes(nodeEnv);
  }

  public static isProd(nodeEnv: string = ''): boolean {
    return ['prod', ''].includes(nodeEnv);
  }

  public static isDev(nodeEnv: string = ''): boolean {
    return nodeEnv === 'dev';
  }
}

export default Environment;
