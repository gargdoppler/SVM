#include "bits/stdc++.h"

using namespace std;

// Definations {{{
#ifdef LOCAL
#include "debug.h"
void helper_string(string s) {
  cout << "---------------- " << s << " ----------------" << endl;
}
#else
#define debug(...) 42
void helper_string(string s) { return; }
#endif

#define int long long
#define double long double

#define endl "\n"
#define space " "
// }}}

// New algos {{{
map<char, int> counter(string s) {
  map<char, int> m;
  for (auto ele : s)
    m[ele]++;
  return m;
}

map<char, pair<int, int>> collective_counter(string a, string b) {
  map<char, pair<int, int>> m;
  for (auto ele : a)
    m[ele].first++;
  for (auto ele : b)
    m[ele].second++;
  return m;
}

string int_to_binary_string(int number) {
  const int bit_size = (int)(sizeof(int) * CHAR_BIT);
  string binary_string = bitset<bit_size>(number).to_string();
  return binary_string;
}

// }}}

// ufo {{{
namespace ufo {
// STRUCT TEMPLATE min
template <class Ty = void> struct min {
  constexpr Ty operator()(const Ty &Left, const Ty &Right) const {
    return (std::min(Left, Right));
  }
};

// STRUCT TEMPLATE SPECIALIZATION min
template <> struct min<void> {
  // transparent functor for operator*
  typedef int is_transparent;

  template <class Ty1, class Ty2>
  constexpr auto operator()(Ty1 &&Left, Ty2 &&Right) const
      -> decltype(std::min(static_cast<Ty1 &&>(Left),
                           static_cast<Ty2 &&>(Right))) {
    return (std::min(static_cast<Ty1 &&>(Left), static_cast<Ty2 &&>(Right)));
  }
};

// STRUCT TEMPLATE max
template <class Ty = void> struct max {
  constexpr Ty operator()(const Ty &Left, const Ty &Right) const {
    return (std::max(Left, Right));
  }
};

// STRUCT TEMPLATE SPECIALIZATION max
template <> struct max<void> {
  // transparent functor for operator*
  typedef int is_transparent;

  template <class Ty1, class Ty2>
  constexpr auto operator()(Ty1 &&Left, Ty2 &&Right) const
      -> decltype(std::max(static_cast<Ty1 &&>(Left),
                           static_cast<Ty2 &&>(Right))) {
    return (std::max(static_cast<Ty1 &&>(Left), static_cast<Ty2 &&>(Right)));
  }
};

// STRUCT TEMPLATE abs_diff
template <class Ty = void> struct abs_diff {
  constexpr Ty operator()(const Ty &Left, const Ty &Right) const {
    return (std::abs(Left - Right));
  }
};

// STRUCT TEMPLATE SPECIALIZATION abs_diff
template <> struct abs_diff<void> {
  // transparent functor for operator*
  typedef int is_transparent;

  template <class Ty1, class Ty2>
  constexpr auto operator()(Ty1 &&Left, Ty2 &&Right) const
      -> decltype(std::abs(static_cast<Ty1 &&>(Left) -
                           static_cast<Ty2 &&>(Right))) {
    return (std::abs(static_cast<Ty1 &&>(Left) - static_cast<Ty2 &&>(Right)));
  }
};
} // namespace ufo
//}}}

// Algos {{{
int binexpo(int a, int b) {
  int res = 1;
  while (b) {
    if (b & 1)
      res *= a;
    a *= a;
    b >>= 1;
  }
  return res;
}

int binexpomod(int a, int b, int mod) {
  int res = 1;
  while (b) {
    if (b & 1)
      res = res * a % mod;
    a = a * a % mod;
    b >>= 1;
  }
  return res;
}

void remove_parent(vector<list<int>> &net, int root) {
  queue<int> nn;
  nn.push(root);
  while (!nn.empty()) {
    int node = nn.front();
    nn.pop();
    for (auto ele : net[node]) {
      net[ele].remove(node);
      nn.push(ele);
    }
  }
}

// }}}

const int MOD = 1e9 + 7;
const int INF = numeric_limits<int>::max();

template <class T1, class T2, class Pred = less<T2>> struct pair_second {
  bool operator()(pair<T1, T2> &left, pair<T1, T2> &right) const {
    Pred pred;
    return pred(left.second, right.second);
  }
};

void solve() {
  int n;
  cin >> n;
  vector<pair<int, int>> vp(n);
  for (auto &ele : vp)
    cin >> ele.first >> ele.second;
  sort(vp.begin(), vp.end(), pair_second<int, int>());
  for (auto it = vp.begin(), jt = next(it); jt != vp.end(); it++, jt++) {
    jt->first = max(it->first, jt->first);
  }

  int c = 0;
  auto it = prev(vp.end());
  while (false) {
    auto jt = lower_bound(vp.begin(), it, it->first);
  }
}

// Main function {{{
signed main() {
  ios::sync_with_stdio(false);
  cin.tie(nullptr);
  cout.tie(nullptr);

  string end_code_string = "------------------- end --------------------";

  solve();

  cerr << endl;
  cerr << endl << end_code_string << endl;

  return 0;
}
// }}}
