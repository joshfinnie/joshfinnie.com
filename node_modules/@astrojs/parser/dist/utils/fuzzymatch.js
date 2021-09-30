var __defProp = Object.defineProperty;
var __markAsModule = (target) => __defProp(target, "__esModule", {value: true});
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, {get: all[name], enumerable: true});
};
__markAsModule(exports);
__export(exports, {
  default: () => fuzzymatch
});
function fuzzymatch(name, names) {
  const set = new FuzzySet(names);
  const matches = set.get(name);
  return matches && matches[0] && matches[0][0] > 0.7 ? matches[0][1] : null;
}
const GRAM_SIZE_LOWER = 2;
const GRAM_SIZE_UPPER = 3;
function _distance(str1, str2) {
  if (str1 === null && str2 === null) {
    throw "Trying to compare two null values";
  }
  if (str1 === null || str2 === null)
    return 0;
  str1 = String(str1);
  str2 = String(str2);
  const distance = levenshtein(str1, str2);
  if (str1.length > str2.length) {
    return 1 - distance / str1.length;
  } else {
    return 1 - distance / str2.length;
  }
}
function levenshtein(str1, str2) {
  const current = [];
  let prev;
  let value;
  for (let i = 0; i <= str2.length; i++) {
    for (let j = 0; j <= str1.length; j++) {
      if (i && j) {
        if (str1.charAt(j - 1) === str2.charAt(i - 1)) {
          value = prev;
        } else {
          value = Math.min(current[j], current[j - 1], prev) + 1;
        }
      } else {
        value = i + j;
      }
      prev = current[j];
      current[j] = value;
    }
  }
  return current.pop();
}
const non_word_regex = /[^\w, ]+/;
function iterate_grams(value, gram_size = 2) {
  const simplified = "-" + value.toLowerCase().replace(non_word_regex, "") + "-";
  const len_diff = gram_size - simplified.length;
  const results = [];
  if (len_diff > 0) {
    for (let i = 0; i < len_diff; ++i) {
      value += "-";
    }
  }
  for (let i = 0; i < simplified.length - gram_size + 1; ++i) {
    results.push(simplified.slice(i, i + gram_size));
  }
  return results;
}
function gram_counter(value, gram_size = 2) {
  const result = {};
  const grams = iterate_grams(value, gram_size);
  let i = 0;
  for (i; i < grams.length; ++i) {
    if (grams[i] in result) {
      result[grams[i]] += 1;
    } else {
      result[grams[i]] = 1;
    }
  }
  return result;
}
function sort_descending(a, b) {
  return b[0] - a[0];
}
class FuzzySet {
  constructor(arr) {
    this.exact_set = {};
    this.match_dict = {};
    this.items = {};
    for (let i = GRAM_SIZE_LOWER; i < GRAM_SIZE_UPPER + 1; ++i) {
      this.items[i] = [];
    }
    for (let i = 0; i < arr.length; ++i) {
      this.add(arr[i]);
    }
  }
  add(value) {
    const normalized_value = value.toLowerCase();
    if (normalized_value in this.exact_set) {
      return false;
    }
    let i = GRAM_SIZE_LOWER;
    for (i; i < GRAM_SIZE_UPPER + 1; ++i) {
      this._add(value, i);
    }
  }
  _add(value, gram_size) {
    const normalized_value = value.toLowerCase();
    const items = this.items[gram_size] || [];
    const index = items.length;
    items.push(0);
    const gram_counts = gram_counter(normalized_value, gram_size);
    let sum_of_square_gram_counts = 0;
    let gram;
    let gram_count;
    for (gram in gram_counts) {
      gram_count = gram_counts[gram];
      sum_of_square_gram_counts += Math.pow(gram_count, 2);
      if (gram in this.match_dict) {
        this.match_dict[gram].push([index, gram_count]);
      } else {
        this.match_dict[gram] = [[index, gram_count]];
      }
    }
    const vector_normal = Math.sqrt(sum_of_square_gram_counts);
    items[index] = [vector_normal, normalized_value];
    this.items[gram_size] = items;
    this.exact_set[normalized_value] = value;
  }
  get(value) {
    const normalized_value = value.toLowerCase();
    const result = this.exact_set[normalized_value];
    if (result) {
      return [[1, result]];
    }
    let results = [];
    for (let gram_size = GRAM_SIZE_UPPER; gram_size >= GRAM_SIZE_LOWER; --gram_size) {
      results = this.__get(value, gram_size);
      if (results) {
        return results;
      }
    }
    return null;
  }
  __get(value, gram_size) {
    const normalized_value = value.toLowerCase();
    const matches = {};
    const gram_counts = gram_counter(normalized_value, gram_size);
    const items = this.items[gram_size];
    let sum_of_square_gram_counts = 0;
    let gram;
    let gram_count;
    let i;
    let index;
    let other_gram_count;
    for (gram in gram_counts) {
      gram_count = gram_counts[gram];
      sum_of_square_gram_counts += Math.pow(gram_count, 2);
      if (gram in this.match_dict) {
        for (i = 0; i < this.match_dict[gram].length; ++i) {
          index = this.match_dict[gram][i][0];
          other_gram_count = this.match_dict[gram][i][1];
          if (index in matches) {
            matches[index] += gram_count * other_gram_count;
          } else {
            matches[index] = gram_count * other_gram_count;
          }
        }
      }
    }
    const vector_normal = Math.sqrt(sum_of_square_gram_counts);
    let results = [];
    let match_score;
    for (const match_index in matches) {
      match_score = matches[match_index];
      results.push([match_score / (vector_normal * items[match_index][0]), items[match_index][1]]);
    }
    results.sort(sort_descending);
    let new_results = [];
    const end_index = Math.min(50, results.length);
    for (let j = 0; j < end_index; ++j) {
      new_results.push([_distance(results[j][1], normalized_value), results[j][1]]);
    }
    results = new_results;
    results.sort(sort_descending);
    new_results = [];
    for (let j = 0; j < results.length; ++j) {
      if (results[j][0] == results[0][0]) {
        new_results.push([results[j][0], this.exact_set[results[j][1]]]);
      }
    }
    return new_results;
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {});
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLi4vLi4vc3JjL3V0aWxzL2Z1enp5bWF0Y2gudHMiXSwKICAibWFwcGluZ3MiOiAiOzs7Ozs7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUdlLG9CQUFvQixNQUFjLE9BQWlCO0FBQ2hFLFFBQU0sTUFBTSxJQUFJLFNBQVM7QUFDekIsUUFBTSxVQUFVLElBQUksSUFBSTtBQUV4QixTQUFPLFdBQVcsUUFBUSxNQUFNLFFBQVEsR0FBRyxLQUFLLE1BQU0sUUFBUSxHQUFHLEtBQUs7QUFBQTtBQU14RSxNQUFNLGtCQUFrQjtBQUN4QixNQUFNLGtCQUFrQjtBQUd4QixtQkFBbUIsTUFBYyxNQUFjO0FBQzdDLE1BQUksU0FBUyxRQUFRLFNBQVMsTUFBTTtBQUNsQyxVQUFNO0FBQUE7QUFFUixNQUFJLFNBQVMsUUFBUSxTQUFTO0FBQU0sV0FBTztBQUMzQyxTQUFPLE9BQU87QUFDZCxTQUFPLE9BQU87QUFFZCxRQUFNLFdBQVcsWUFBWSxNQUFNO0FBQ25DLE1BQUksS0FBSyxTQUFTLEtBQUssUUFBUTtBQUM3QixXQUFPLElBQUksV0FBVyxLQUFLO0FBQUEsU0FDdEI7QUFDTCxXQUFPLElBQUksV0FBVyxLQUFLO0FBQUE7QUFBQTtBQUsvQixxQkFBcUIsTUFBYyxNQUFjO0FBQy9DLFFBQU0sVUFBb0I7QUFDMUIsTUFBSTtBQUNKLE1BQUk7QUFFSixXQUFTLElBQUksR0FBRyxLQUFLLEtBQUssUUFBUSxLQUFLO0FBQ3JDLGFBQVMsSUFBSSxHQUFHLEtBQUssS0FBSyxRQUFRLEtBQUs7QUFDckMsVUFBSSxLQUFLLEdBQUc7QUFDVixZQUFJLEtBQUssT0FBTyxJQUFJLE9BQU8sS0FBSyxPQUFPLElBQUksSUFBSTtBQUM3QyxrQkFBUTtBQUFBLGVBQ0g7QUFDTCxrQkFBUSxLQUFLLElBQUksUUFBUSxJQUFJLFFBQVEsSUFBSSxJQUFJLFFBQVE7QUFBQTtBQUFBLGFBRWxEO0FBQ0wsZ0JBQVEsSUFBSTtBQUFBO0FBR2QsYUFBTyxRQUFRO0FBQ2YsY0FBUSxLQUFL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
