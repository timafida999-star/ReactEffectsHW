
const styles = {
  effect: "color:#2a9d8f;font-weight:600",
  cleanup: "color:#c9a227;font-weight:600",
  ignored: "color:#d64545;font-weight:600",
  done: "color:#5bb35b;font-weight:600",
  action: "color:#8e6ccb;font-weight:600",
};

export function log(type, message) {
  console.log(`%c[${type}]%c ${message}`, styles[type] ?? "", "color:inherit");
}
