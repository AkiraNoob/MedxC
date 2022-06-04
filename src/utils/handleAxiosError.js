const handleAxiosError = (axiosErrorObject) => {
  if (axiosErrorObject) {
    if (axiosErrorObject.isAxiosError) {
      const {
        response: { status, data },
      } = axiosErrorObject;

      return { status, message: data, isAxiosError: true };
    }
  }

  return { isAxiosError: false };
};

module.exports = {
  handleAxiosError,
};
