export const combineFilters = (...filters: ((req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void)[]): ((req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => void) => {
  return (req: Request, file: Express.Multer.File, callback: (error: Error | null, acceptFile: boolean) => void) => {
    // Variable to track if any filter has rejected the file
    let rejected = false;
    // Iterate through each filter
    for (const filter of filters) {
      // If any filter rejects the file, set the rejected flag to true
      filter(req, file, (error, acceptFile) => {
        if (!acceptFile) {
          rejected = true;
        }
      });
      // If the file is rejected by any filter, exit the loop
      if (rejected) {
        break;
      }
    }
    // If any filter has rejected the file, invoke the callback with an error
    if (rejected) {
      callback(new Error('File rejected by one or more filters'), false);
    } else {
      // Otherwise, accept the file
      callback(null, true);
    }
  };
};
