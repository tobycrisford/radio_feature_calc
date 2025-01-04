class CurrentCovering {
    constructor(required_features) {
      this.feature_count = {};
      for (const feature of required_features) {
        this.feature_count[feature] = 0;
      }
      this.n_missing = required_features.length;
    }
  
    incrementFeatures(features) {
      for (const feature of features) {
        if (!(feature in this.feature_count)) {
          continue;
        }
        this.feature_count[feature] += 1;
        if (this.feature_count[feature] === 1) {
          this.n_missing -= 1;
        }
      }
      return this.n_missing;
    }
  
    decrementFeatures(features) {
      for (const feature of features) {
        if (!(feature in this.feature_count)) {
          continue;
        }
        this.feature_count[feature] -= 1;
        if (this.feature_count[feature] === 0) {
          this.n_missing += 1;
        }
      }
    }
  }
  
  function loadData(data) {
    let serials = {};
    let rows = [];
    for (let i = 1;i < data.length;i++) {
      rows.push(data[i][0]);
    }
    for (let i = 1;i < data[0].length;i++) {
      serials[data[0][i]] = [];
      for (let j = 1;j < data.length;j++) {
        if (data[j][i] === 1) {
          serials[data[0][i]].push(rows[j - 1]);
        }
      }
    }
    return serials;
  }
  
  function findCovering(current_covering, current_serials, n_serials_to_add, serials, serial_names, start_index) {
    if (n_serials_to_add > (serial_names.length - start_index)) {
      return null;
    }
    for (let i = start_index;i < serial_names.length;i++) {
      current_serials.push(i);
      let current_missing = current_covering.n_missing;
      let remaining_features = current_covering.incrementFeatures(serials[serial_names[i]]);
      // Logger.log("Adding " + serial_names[i]);
      if (remaining_features === 0) {
        return current_serials;
      }
      if ((remaining_features !== current_missing) && (n_serials_to_add > 1)) {
        let deeper_attempt = findCovering(current_covering, current_serials, n_serials_to_add - 1, serials, serial_names, i + 1);
        if (deeper_attempt !== null) {
          return deeper_attempt;
        }
      }
      current_covering.decrementFeatures(serials[serial_names[i]]);
      current_serials.pop();
      // Logger.log("Removing " + serial_names[i]);
    }
    return null;
  }
  
  function cleanFeatures(features) {
    let clean_features = [];
    for (const feature of features) {
      // Logger.log("Feature: " + feature + "Length: " + feature.toString().length);
      if (feature.toString().length > 0) {
        clean_features.push(feature);
      }
    }
    return clean_features;
  }
  
  function findMinimalSerials(data, required_features) {
    let clean_features = cleanFeatures(required_features);
    // Logger.log("Required features: " + clean_features);
    let serials = loadData(data);
    let current_covering = new CurrentCovering(clean_features);
    let serial_names = [];
    for (const serial_name in serials) {
      serial_names.push(serial_name);
    }
    
    let current_result = null;
    for (let i = 1;i < serial_names.length + 1;i++) {
      current_result = findCovering(current_covering, [], i, serials, serial_names, 0);
      if (current_result !== null) {
        break;
      }
    }
  
    if (current_result === null) {
      return null;
    }
  
    let final_result = [];
    for (const idx of current_result) {
      final_result.push(serial_names[idx]);
    }
  
    return final_result;
  }