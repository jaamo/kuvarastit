module.exports = function(
  requiredFields: Array<string>,
  fields: { [key: string]: string }
) {
  // Make sure all fields exists.
  const errorField: string | undefined = requiredFields.find((el: string) => {
    return typeof fields[el] == "undefined" || fields[el] == "";
  });

  // In case errors found return it.
  if (errorField) {
    const err: any = new Error("Field missing: " + errorField);
    err.status = 401;
    err.customCode = "MISSING_" + errorField.toUpperCase();
    return err;
  } else {
    return false;
  }
};
