{
  /*
   * validations.js
   *
   * Re-usable code for Pre-authenticated validations
   *
   * Author: Dominic Domingo
   * Created: 12/05/2019
   *
   */
}

export const isValidEmail = email => {
  // check email format
  // source: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/email#Validation
  return /^[a-zA-Z0-9.!#$%&'*+\\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/.test(
    email
  )
}

export const isValidPassword = password => {
  // check password length
  return password.length >= 6
}
