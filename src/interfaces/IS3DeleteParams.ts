import IS3Params from './IS3Params';

interface IS3DeleteParams extends IS3Params {
  Delete: {
    Objects: Array<{
      Key: string
    }>,
    Quiet: boolean
  };
}

export default IS3DeleteParams;
