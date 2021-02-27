快速幂，二进制取幂（Binary Exponentiation，也称平方法），是一个在 $\Theta(\log n)$ 的时间内计算 $a^n$ 的小技巧，而暴力的计算需要 $\Theta(n)$ 的时间。而这个技巧也常常用在非计算的场景，因为它可以应用在任何具有结合律的运算中。其中显然的是它可以应用于模意义下取幂、矩阵幂等运算，我们接下来会讨论。

## 算法描述

计算 $a$ 的 $n$ 次方表示将 $n$ 个 $a$ 乘在一起： $a^{n} = \underbrace{a \times a \cdots \times a}_{n\text{ 个 a}}$ 。然而当 $a,n$ 太大的时侯，这种方法就不太适用了。不过我们知道： $a^{b+c} = a^b \cdot a^c,\,\,a^{2b} = a^b \cdot a^b = (a^b)^2$ 。二进制取幂的想法是，我们将取幂的任务按照指数的 **二进制表示** 来分割成更小的任务。

首先我们将 $n$ 表示为 2 进制，举一个例子：

$$
3^{13} = 3^{(1101)_2} = 3^8 \cdot 3^4 \cdot 3^1
$$

因为 $n$ 有 $\lfloor \log_2 n \rfloor + 1$ 个二进制位，因此当我们知道了 $a^1, a^2, a^4, a^8, \dots, a^{2^{\lfloor \log_2 n \rfloor}}$ 后，我们只用计算 $\Theta(\log n)$ 次乘法就可以计算出 $a^n$ 。

于是我们只需要知道一个快速的方法来计算上述 3 的 $2^k$ 次幂的序列。这个问题很简单，因为序列中（除第一个）任意一个元素就是其前一个元素的平方。举一个例子：

$$
\begin{align}
3^1 &= 3 \\
3^2 &= \left(3^1\right)^2 = 3^2 = 9 \\
3^4 &= \left(3^2\right)^2 = 9^2 = 81 \\
3^8 &= \left(3^4\right)^2 = 81^2 = 6561
\end{align}
$$

因此为了计算 $3^{13}$ ，我们只需要将对应二进制位为 1 的整系数幂乘起来就行了：

$$
3^{13} = 6561 \cdot 81 \cdot 3 = 1594323
$$

将上述过程说得形式化一些，如果把 $n$ 写作二进制为 $(n_tn_{t-1}\cdots n_1n_0)_2$ ，那么有：

$$
n = n_t2^t + n_{t-1}2^{t-1} + n_{t-2}2^{t-2} + \cdots + n_12^1 + n_02^0
$$

其中 $n_i\in\{0,1\}$ 。那么就有

$$
\begin{aligned}
a^n & = (a^{n_t 2^t + \cdots + n_0 2^0})\\\\
& = a^{n_0 2^0} \times a^{n_1 2^1}\times \cdots \times a^{n_t2^t}
\end{aligned}
$$

根据上式我们发现，原问题被我们转化成了形式相同的子问题的乘积，并且我们可以在常数时间内从 $2^i$ 项推出 $2^{i+1}$ 项。

这个算法的复杂度是 $\Theta(\log n)$ 的，我们计算了 $\Theta(\log n)$ 个 $2^k$ 次幂的数，然后花费 $\Theta(\log n)$ 的时间选择二进制为 1 对应的幂来相乘。

## 代码实现

首先我们可以直接按照上述递归方法实现：

```cpp
long long binpow(long long a, long long b) {
  if (b == 0) return 1;
  long long res = binpow(a, b / 2);
  if (b % 2)
    return res * res * a;
  else
    return res * res;
}
```

第二种实现方法是非递归式的。它在循环的过程中将二进制位为 1 时对应的幂累乘到答案中。尽管两者的理论复杂度是相同的，但第二种在实践过程中的速度是比第一种更快的，因为递归会花费一定的开销。

```cpp
long long binpow(long long a, long long b) {
  long long res = 1;
  while (b > 0) {
    if (b & 1) res = res * a;
    a = a * a;
    b >>= 1;
  }
  return res;
}
```

模板： [Luogu P1226](https://www.luogu.com.cn/problem/P1226)

## 应用

### 模意义下取幂

???+note "问题描述"
计算 $x^n\bmod m$ 。

这是一个非常常见的应用，例如它可以用于计算模意义下的乘法逆元。

既然我们知道取模的运算不会干涉乘法运算，因此我们只需要在计算的过程中取模即可。

```cpp
long long binpow(long long a, long long b, long long m) {
  a %= m;
  long long res = 1;
  while (b > 0) {
    if (b & 1) res = res * a % m;
    a = a * a % m;
    b >>= 1;
  }
  return res;
}
```

注意：根据费马小定理，如果 $m$ 是一个质数，我们可以计算 $x^{n\bmod (m-1)}$ 来加速算法过程。

### 计算斐波那契数

???+note "问题描述"
计算斐波那契数列第 $n$ 项 $F_n$ 。

根据斐波那契数列的递推式 $F_n = F_{n-1} + F_{n-2}$ ，我们可以构建一个 $2\times 2$ 的矩阵来表示从 $F_i,F_{i+1}$ 到 $F_{i+1},F_{i+2}$ 的变换。于是在计算这个矩阵的 $n$ 次幂的时侯，我们使用快速幂的思想，可以在 $\Theta(\log n)$ 的时间内计算出结果。对于更多的细节参见 [斐波那契数列](./fibonacci.md) 。

### 多次置换

???+note "问题描述"
给你一个长度为 $n$ 的序列和一个置换，把这个序列置换 $k$ 次。

简单地把这个置换取 $k$ 次幂，然后把它应用到序列 $n$ 上即可。时间复杂度是 $O(n \log k)$ 的。

注意：给这个置换建图，然后在每一个环上分别做 $k$ 次幂（事实上做一下 $k$ 对环长取模的运算即可）可以取得更高效的算法，达到 $O(n)$ 的复杂度。

### 加速几何中对点集的操作

> 三维空间中， $n$ 个点 $p_i$ ，要求将 $m$ 个操作都应用于这些点。包含 3 种操作：
>
> 1. 沿某个向量移动点的位置（Shift）。
> 2. 按比例缩放这个点的坐标（Scale）。
> 3. 绕某个坐标轴旋转（Rotate）。
>
> 还有一个特殊的操作，就是将一个操作序列重复 $k$ 次（Loop），这个序列中也可能有 Loop 操作（Loop 操作可以嵌套）。现在要求你在低于 $O(n \cdot length)$ 的时间内将这些变换应用到这个 $n$ 个点，其中 $length$ 表示把所有的 Loop 操作展开后的操作序列的长度。

让我们来观察一下这三种操作对坐标的影响：

1. Shift 操作：将每一维的坐标分别加上一个常量；
2. Scale 操作：把每一维坐标分别乘上一个常量；
3. Rotate 操作：这个有点复杂，我们不打算深入探究，不过我们仍然可以使用一个线性组合来表示新的坐标。

可以看到，每一个变换可以被表示为对坐标的线性运算，因此，一个变换可以用一个 $4\times 4$ 的矩阵来表示：

$$
\begin{bmatrix}
a_{11} & a_ {12} & a_ {13} & a_ {14} \\
a_{21} & a_ {22} & a_ {23} & a_ {24} \\
a_{31} & a_ {32} & a_ {33} & a_ {34} \\
a_{41} & a_ {42} & a_ {43} & a_ {44} \\
\end{bmatrix}
$$

使用这个矩阵就可以将一个坐标（向量）进行变换，得到新的坐标（向量）：

$$
\begin{bmatrix}
a_{11} & a_ {12} & a_ {13} & a_ {14} \\
a_{21} & a_ {22} & a_ {23} & a_ {24} \\
a_{31} & a_ {32} & a_ {33} & a_ {34} \\
a_{41} & a_ {42} & a_ {43} & a_ {44} \\
\end{bmatrix}\cdot
\begin{bmatrix} x \\ y \\ z \\ 1 \end{bmatrix}
 = \begin{bmatrix} x' \\ y' \\ z' \\ 1 \end{bmatrix}
$$

你可能会问，为什么一个三维坐标会多一个 1 出来？原因在于，如果没有这个多出来的 1，我们没法使用矩阵的线性变换来描述 Shift 操作。

接下来举一些简单的例子来说明我们的思路：

1.  Shift 操作：让 $x$ 坐标方向的位移为 $5$ ， $y$ 坐标的位移为 $7$ ， $z$ 坐标的位移为 $9$ ：

    $$
    \begin{bmatrix}
    1 & 0 & 0 & 5 \\
    0 & 1 & 0 & 7 \\
    0 & 0 & 1 & 9 \\
    0 & 0 & 0 & 1 \\
    \end{bmatrix}
    $$

2.  Scale 操作：把 $x$ 坐标拉伸 10 倍， $y,z$ 坐标拉伸 5 倍：

    $$
    \begin{bmatrix}
    10 & 0 & 0 & 0 \\
    0 & 5 & 0 & 0 \\
    0 & 0 & 5 & 0 \\
    0 & 0 & 0 & 1 \\
    \end{bmatrix}
    $$

3.  Rotate 操作：绕 $x$ 轴旋转 $\theta$ 弧度，遵循右手定则（逆时针方向）

    $$
    \begin{bmatrix}
    1 & 0 & 0 & 0 \\
    0 & \cos \theta & \sin \theta & 0 \\
    0 & -\sin \theta & \cos \theta & 0 \\
    0 & 0 & 0 & 1 \\
    \end{bmatrix}
    $$

现在，每一种操作都被表示为了一个矩阵，变换序列可以用矩阵的乘积来表示，而一个 Loop 操作相当于取一个矩阵的 k 次幂。这样可以用 $O(m \log k)$ 计算出整个变换序列最终形成的矩阵。最后将它应用到 $n$ 个点上，总复杂度 $O(n + m \log k)$ 。

### 定长路径计数

???+note "问题描述"
给一个有向图（边权为 1），求任意两点 $u,v$ 间从 $u$ 到 $v$ ，长度为 $k$ 的路径的条数。

我们把该图的邻接矩阵 M 取 k 次幂，那么 $M_{i,j}$ 就表示从 $i$ 到 $j$ 长度为 $k$ 的路径的数目。该算法的复杂度是 $O(n^3 \log k)$ 。有关该算法的细节请参见 [矩阵](./matrix.md) 页面。

### 模意义下大整数乘法

> 计算 $a\times b\bmod m,\,\,a,b\le m\le 10^{18}$ 。

与二进制取幂的思想一样，这次我们将其中的一个乘数表示为若干个 2 的整数次幂的和的形式。因为在对一个数做乘 2 并取模的运算的时侯，我们可以转化为加减操作防止溢出。这样仍可以在 $O (\log_2 m)$ 的时内解决问题。递归方法如下：

$$
a \cdot b = \begin{cases}
0 &\text{if }a = 0 \\\\
2 \cdot \frac{a}{2} \cdot b &\text{if }a > 0 \text{ and }a \text{ even} \\\\
2 \cdot \frac{a-1}{2} \cdot b + b &\text{if }a > 0 \text{ and }a \text{ odd}
\end{cases}
$$

注意：你也可以利用双精度浮点数在常数时间内计算大整数乘法。因为 $a\times b\bmod m=a\times b-\left\lfloor\frac{a\times b}{m}\right\rfloor m$ 。由于 $a,b<m$ ，因此 $\left\lfloor\frac{a\times b}{m}\right\rfloor<m$ ，于是可以用双精度浮点数计算这个分式。作差的时侯直接自然溢出。因为两者的差是一定小于 $m$ 的，我们只关心低位。这样再调整一下正负性就行了。更多信息参见 [这里](https://cs.stackexchange.com/questions/77016/modular-multiplication) 。

### 高精度快速幂

??? note "前置技能"
请先学习 [高精度](./bignum.md)

???+note " 例题【NOIP2003 普及组改编·麦森数】（[原题在此](https://www.luogu.com.cn/problem/P1045)）"
题目大意：从文件中输入 P（1000&lt;P&lt;3100000），计算 $2^P−1$ 的最后 100 位数字（用十进制高精度数表示），不足 100 位时高位补 0。

代码实现如下：

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[505], b[505], t[505], i, j;
int mult(int x[], int y[])  // 高精度乘法
{
  memset(t, 0, sizeof(t));
  for (i = 1; i <= x[0]; i++) {
    for (j = 1; j <= y[0]; j++) {
      if (i + j - 1 > 100) continue;
      t[i + j - 1] += x[i] * y[j];
      t[i + j] += t[i + j - 1] / 10;
      t[i + j - 1] %= 10;
      t[0] = i + j;
    }
  }
  memcpy(b, t, sizeof(b));
}
void ksm(int p)  // 快速幂
{
  if (p == 1) {
    memcpy(b, a, sizeof(b));
    return;
  }
  ksm(p / 2);
  mult(b, b);
  if (p % 2 == 1) mult(b, a);
}
int main() {
  int p;
  scanf("%d", &p);
  a[0] = 1;
  a[1] = 2;
  b[0] = 1;
  b[1] = 1;
  ksm(p);
  for (i = 100; i >= 1; i--) {
    if (i == 1) {
      printf("%d\n", b[i] - 1);
    } else
      printf("%d", b[i]);
  }
}
```

## 习题

- [UVa 1230 - MODEX](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=3671)
- [UVa 374 - Big Mod](http://uva.onlinejudge.org/index.php?option=com_onlinejudge&Itemid=8&category=24&page=show_problem&problem=310)
- [UVa 11029 - Leading and Trailing](https://uva.onlinejudge.org/index.php?option=onlinejudge&page=show_problem&problem=1970)
- [Codeforces - Parking Lot](http://codeforces.com/problemset/problem/630/I)
- [SPOJ - The last digit](http://www.spoj.com/problems/LASTDIG/)
- [SPOJ - Locker](http://www.spoj.com/problems/LOCKER/)
- [LA - 3722 Jewel-eating Monsters](https://icpcarchive.ecs.baylor.edu/index.php?option=com_onlinejudge&Itemid=8&page=show_problem&problem=1723)
- [SPOJ - Just add it](http://www.spoj.com/problems/ZSUM/)

  **本页面部分内容译自博文 [Бинарное возведение в степень](http://e-maxx.ru/algo/binary_pow) 与其英文翻译版 [Binary Exponentiation](https://cp-algorithms.com/algebra/binary-exp.html) 。其中俄文版版权协议为 Public Domain + Leave a Link；英文版版权协议为 CC-BY-SA 4.0。**

$$
\begin{eqnarray*}
f(x) = 3^x
\end{eqnarray*}
$$

$$
\%
$$

# Editor.md

**目录 (Table of Contents)**

[TOC]

# Heading 1

## Heading 2

### Heading 3

#### Heading 4

##### Heading 5

###### Heading 6

# Heading 1 link [Heading link](https://github.com/pandao/editor.md "Heading link")

## Heading 2 link [Heading link](https://github.com/pandao/editor.md "Heading link")

### Heading 3 link [Heading link](https://github.com/pandao/editor.md "Heading link")

#### Heading 4 link [Heading link](https://github.com/pandao/editor.md "Heading link") Heading link [Heading link](https://github.com/pandao/editor.md "Heading link")

##### Heading 5 link [Heading link](https://github.com/pandao/editor.md "Heading link")

###### Heading 6 link [Heading link](https://github.com/pandao/editor.md "Heading link")

#### 标题（用底线的形式）Heading (underline)

# This is an H1

## This is an H2

### 字符效果和横线等

---

~~删除线~~ <s>删除线（开启识别 HTML 标签时）</s>
_斜体字_ _斜体字_
**粗体** **粗体**
**_粗斜体_** **_粗斜体_**

上标：X<sub>2</sub>，下标：O<sup>2</sup>

**缩写(同 HTML 的 abbr 标签)**

> 即更长的单词或短语的缩写形式，前提是开启识别 HTML 标签时，已默认开启

The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

### 引用 Blockquotes

> 引用文本 Blockquotes

引用的行内混合 Blockquotes

> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

### 锚点与链接 Links

GFM a-tail link @pandao 邮箱地址自动链接 test.test@gmail.com www@vip.qq.com

> @pandao

### 多语言代码高亮 Codes

#### 行内代码 Inline code

执行命令：`npm install marked`

#### 缩进风格

即缩进四个空格，也做为实现类似 `<pre>` 预格式化文本 ( Preformatted Text ) 的功能。

    <?php
        echo "Hello world!";
    ?>

预格式化文本：

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

#### JS 代码　

```javascript
function test() {
  console.log("Hello world!");
}

(function () {
  var box = function () {
    return box.fn.init();
  };

  box.prototype = box.fn = {
    init: function () {
      console.log("box.init()");

      return this;
    },

    add: function (str) {
      alert("add", str);

      return this;
    },

    remove: function (str) {
      alert("remove", str);

      return this;
    },
  };

  box.fn.init.prototype = box.fn;

  window.box = box;
})();

var testBox = box();
testBox.add("jQuery").remove("jQuery");
```

#### HTML 代码 HTML codes

```html
<!DOCTYPE html>
<html>
  <head>
    <mate charest="utf-8" />
    <meta name="keywords" content="Editor.md, Markdown, Editor" />
    <title>Hello world!</title>
    <style type="text/css">
      body {
        font-size: 14px;
        color: #444;
        font-family: "Microsoft Yahei", Tahoma, "Hiragino Sans GB", Arial;
        background: #fff;
      }
      ul {
        list-style: none;
      }
      img {
        border: none;
        vertical-align: middle;
      }
    </style>
  </head>
  <body>
    <h1 class="text-xxl">Hello world!</h1>
    <p class="text-green">Plain text</p>
  </body>
</html>
```

### 图片 Images

Image:

> Follow your heart.

> 图为：厦门白城沙滩

图片加链接 (Image + Link)：

> 图为：李健首张专辑《似水流年》封面

---

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)

- 列表一
- 列表二
- 列表三

#### 无序列表（星号）Unordered Lists (\*)

- 列表一
- 列表二
- 列表三

#### 无序列表（加号和嵌套）Unordered Lists (+)

- 列表一
- 列表二
  - 列表二-1
  - 列表二-2
  - 列表二-3
- 列表三
  - 列表一
  - 列表二
  - 列表三

#### 有序列表 Ordered Lists (-)

1. 第一行
2. 第二行
3. 第三行

#### GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
  - [ ] GFM task list 3-1
  - [ ] GFM task list 3-2
  - [ ] GFM task list 3-3
- [ ] GFM task list 4
  - [ ] GFM task list 4-1
  - [ ] GFM task list 4-2

---

### 绘制表格 Tables

| 项目   |  价格 | 数量 |
| ------ | ----: | :--: |
| 计算机 | $1600 |  5   |
| 手机   |   $12 |  12  |
| 管线   |    $1 | 234  |

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| Function name | Description                |
| ------------- | -------------------------- |
| `help()`      | Display the help window.   |
| `destroy()`   | **Destroy your computer!** |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ | :-------------: | ------------: |
| col 3 is      | some wordy text |         $1600 |
| col 2 is      |    centered     |           $12 |
| zebra stripes |    are neat     |            $1 |

| Item     | Value |
| -------- | ----: |
| Computer | $1600 |
| Phone    |   $12 |
| Pipe     |    $1 |

---

#### 特殊符号 HTML Entities Codes

&copy; & &uml; &trade; &iexcl; &pound;
&amp; &lt; &gt; &yen; &euro; &reg; &plusmn; &para; &sect; &brvbar; &macr; &laquo; &middot;

X&sup2; Y&sup3; &frac34; &frac14; &times; &divide; &raquo;

18&ordm;C &quot; &apos;

[========]

### Emoji 表情 :smiley:

> Blockquotes :star:

#### GFM task lists & Emoji & fontAwesome icon emoji & editormd logo emoji :editormd-logo-5x:

- [x] :smiley: @mentions, :smiley: #refs, [links](), **formatting**, and <del>tags</del> supported :editormd-logo:;
- [x] list syntax required (any unordered or ordered list supported) :editormd-logo-3x:;
- [x] [ ] :smiley: this is a complete item :smiley:;
- [ ] []this is an incomplete item [test link](#) :fa-star: @pandao;
- [ ] [ ]this is an incomplete item :fa-star: :fa-gear:;
  - [ ] :smiley: this is an incomplete item [test link](#) :fa-star: :fa-gear:;
  - [ ] :smiley: this is :fa-star: :fa-gear: an incomplete item [test link](#);

#### 反斜杠 Escape

\*literal asterisks\*

我们可以看出从 `DOMContentLoaded` 和 `Load` 两个值来比较，`flex` 模型的性能都是优于 `float` 模型的。

<details class = 'info' open>
<summary>目录</summary>

[TOC]

</details>

- 支持“标准”Markdown / CommonMark 和 Github 风格的语法，也可变身为代码编辑器；
- 支持实时预览、图片（跨域）上传、预格式文本/代码/表格插入、代码折叠、搜索替换、只读模式、自定义样式主题和多语言语法高亮等功能；
- 支持 ToC（Table of Contents）、Emoji 表情、Task lists、@链接等 Markdown 扩展语法；
- 支持 TeX 科学公式（基于 KaTeX）、流程图 Flowchart 和 时序图 Sequence Diagram;
- 支持识别和解析 HTML 标签，并且支持自定义过滤标签解析，具有可靠的安全性和几乎无限的扩展性；
- 支持 AMD / CMD 模块化加载（支持 Require.js & Sea.js），并且支持自定义扩展插件；
- 兼容主流的浏览器（IE8+）和 Zepto.js，且支持 iPad 等平板设备；
- 支持自定义主题样式；

#### 标题（用底线的形式）Heading (underline)

# This is an H1

## This is an H2

### 表格

|                           Name                            |    Date    |   Award   | Rank | Solved |  A  |  B  |  C  |  D  |  E  |  F  |  G  |  H  |  I  |  J  |  K  |  L  |  M  |
| :-------------------------------------------------------: | :--------: | :-------: | :--: | :----: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: | :-: |
|                      2018 ZJPSC$2^x$                      | 2018.4.29  |  Bronze   |  86  |  6/13  |  O  |  O  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |  O  |  O  |  O  |  O  |
|                  2018 CCPC Jilin Onsite                   | 2018.9.22  |  Bronze   |  95  |  5/12  |  O  |  O  |  O  |  O  |  O  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |
|                 2018 ICPC Shenyang Onsite                 | 2018.10.21 |  Bronze   |  74  |  2/13  |  .  |  .  |  O  |  .  |  .  |  .  |  .  |  .  |  .  |  O  |  .  |  .  |  .  |
|                 2018 ICPC Tsingdao Onsite                 | 2018.11.4  | Honorable | 241  |  3/13  |  .  |  .  |  O  |  .  |  .  |  .  |  .  |  .  |  .  |  O  |  .  |  .  |  O  |
|                      2018 CCPC Final                      | 2018.11.25 |  Bronze   |  43  |  5/12  |  O  |  O  |  .  |  .  |  .  |  .  |  O  |  .  |  O  |  .  |  .  |  O  |
|                        2019 ZJPSC                         | 2019.4.27  |   Gold    |  7   |  9/13  |  .  |  O  |  O  |  .  |  O  |  O  |  O  |  O  |  O  |  O  |  O  |  .  |  .  |
| 2019 ICPC China Nanchang Invitational Programming Contest |  2019.6.1  |  Silver   |  64  |  5/12  |  .  |  .  |  .  |  .  |  .  |  O  |  O  |  .  |  .  |  O  |  O  |  O  |
|               2019 CCPC Qinghuangdao Onsite               | 2019.9.22  |  Bronze   |  80  |  4/12  |  O  |  .  |  .  |  O  |  .  |  O  |  .  |  .  |  O  |  .  |  .  |  .  |
|                  2019 CCPC Xiamen Onsite                  | 2019.10.22 |  Silver   |  36  |  5/12  |  O  |  .  |  .  |  O  |  .  |  .  |  O  |  O  |  .  |  O  |  .  |  .  |
|                 2019 ICPC Nanjing Onsite                  | 2019.10.27 |  Silver   |  40  |  5/11  |  O  |  .  |  O  |  .  |  .  |  O  |  .  |  O  |  .  |  .  |  O  |
|                 2019 ICPC Nanchang Onsite                 | 2019.11.10 |   Gold    |  28  |  5/13  |  .  |  .  |  O  |  .  |  O  |  .  |  O  |  .  |  .  |  .  |  O  |  O  |  .  |
|                      2019 CCPC Final                      | 2019.11.17 | Honorable |  91  |  3/12  |  O  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |  .  |  O  |  O  |
|                    2019 ICPC EC Final                     | 2019.12.15 |  Silver   |  87  |  4/13  |  O  |  .  |  .  |  .  |  O  |  .  |  .  |  O  |  .  |  .  |  .  |  .  |  O  |

| Name | Score |
| :--: | :---: |
| Dup4 |   0   |

### 内容折叠

<details class = 'success'>
<summary>成功</summary>

$$
\begin{eqnarray*}
f(x) &=& 2^x \\
g(x) &=& 3^x
\end{eqnarray*}
$$

$$
\begin{eqnarray*}
f(x) &=& 2^x \\
g(x) &=& 3^x
\end{eqnarray*}
$$

```cpp
#include <bits/stdc++.h>
using namespace std;
$$2^x$$
```

</details>

<details class = 'info'>
<summary>信息</summary>

每一行输入$n$个数，$2^x$, 最终以$2^n$结尾。

$$
\sum\limits_{i = 1}^n 2^i
$$

$$
\begin{eqnarray*}
f(x) &=& 2^x \\
g(x) &=& 3^x
\end{eqnarray*}
$$

$$
\begin{eqnarray*}
f(x) = 2^x
\end{eqnarray*}
$$

$$
\begin{eqnarray*}
f(x) = 2^x
\end{eqnarray*}
$$

$$
\left( \sum\limits_{k=1}^n a_k b_k \right)^2
\leq
\left( \sum\limits_{k=1}^n a_k^2 \right)
\left( \sum\limits_{k=1}^n b_k^2 \right)$$$$\displaystyle
    \frac{1}{
        \Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{
        \frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {
        1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}}
         {1+\cdots} }
        }
    }$$$$f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$

```cpp
#include <bits/stdc++.h>
using namespace std;
```

</details>

<details class = 'danger'>
<summary>危险</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;
```

</details>

<details class = 'note'>
<summary>笔记</summary>

```cpp
//潘律旨
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

#define dbg(x...) do { cout << "\033[32;1m" << #x << " -> "; err(x); } while (0)
void err() { cout << "\033[39;0m" << endl; }
template <class T, class... Ts> void err(const T& arg, const Ts&... args) { cout << arg << ' '; err(args...); }

const int mod = 1e9 + 7;
const int N = 5e3 + 10;
int n, S, B, f[N][N];

ll qpow(ll base, ll n) {
	ll res = 1;
	while (n) {
		if (n & 1) res = res * base % mod;
		base = base * base % mod;
		n >>= 1;
	}
	return res;
}

ll inv(ll x, ll mod) { return qpow(x, mod - 2); }

int main() {
	scanf("%d%d", &S, &B);
	n = B;
	memset(f, 0, sizeof f);
	for (int i = 0; i <= n; ++i) f[i][0] = 1, f[1][i] = 1;
	for (int i = 2; i <= n; ++i) {
		for (int j = 1; j < i; ++j) {
			f[i][j] = f[j][j];
		}
		for (int j = i; j <= n; ++j) {
			f[i][j] = (f[i - 1][j] + f[i][j - i]) % mod;
		}
	}
	ll res = 0;
	for (int i = 1; i < S; ++i) {
		for (int j = 0; j <= B - S; ++j) {
			dbg(i, j, S - i, B - S - j, f[i][j], f[S - i][B - S - j]);
			res += 1ll * f[i][j] * f[S - i][B - S - j] % mod;
			res %= mod;
		}
	}
	cout << res << endl;
	res += 2ll * f[S][B - S] % mod;
	res %= mod;
//	if ((B - S) % S == 0)
		res = (mod + res - S + 1) % mod;
		cout << res << endl;
	res = res * inv(2, mod) % mod;
//	res += 2ll * f[S][B - S] % mod;
	//cout << res << endl;
//	res = res * inv(S - 1, mod) % mod;
//	if ((B - S) % S == 0) res = (mod + res - 1) % mod;
//	cout << res << endl;
//	res %= mod;
//	cout << f[S][B - S] << endl;
//	res = (mod + res - 1) % mod;
	printf("%lld\n", res);
	return 0;
}
```

$\displaystyle 2^x$

$$
\sum\limits_{i = 1}^n f(x) = 2^x
$$

$$
f(x) = 2^x
$$

$$
f(x) = 2^x
$$

$$
\begin{eqnarray*}
f(x) &=& 3^x \\
g(x) &=& 4^x
\end{eqnarray*}
$$

</details>

### 字符效果和横线等

---

~~删除线~~ <s>删除线（开启识别 HTML 标签时）</s>
_斜体字_ _斜体字_
**粗体** **粗体**
**_粗斜体_** **_粗斜体_**

上标：X<sub>2</sub>，下标：O<sup>2</sup>

**缩写(同 HTML 的 abbr 标签)**

> 即更长的单词或短语的缩写形式，前提是开启识别 HTML 标签时，已默认开启

The <abbr title="Hyper Text Markup Language">HTML</abbr> specification is maintained by the <abbr title="World Wide Web Consortium">W3C</abbr>.

### 引用 Blockquotes

> 引用文本 Blockquotes

引用的行内混合 Blockquotes

> 引用：如果想要插入空白换行`即<br />标签`，在插入处先键入两个以上的空格然后回车即可，[普通链接](http://localhost/)。

### 锚点与链接 Links

[普通链接](http://localhost/)

[普通链接带标题](http://localhost/ "普通链接带标题")

直接链接：<https://github.com>

[锚点链接][anchor-id]

[anchor-id]: http://www.this-anchor-link.com/

GFM a-tail link @pandao

> @pandao

### 多语言代码高亮 Codes

#### 行内代码 Inline code

执行命令：`npm install marked`

多组数据。
每组数据第一行给出一个正整数$n(1 \leq n \leq 10^5)$，接下来$n$个数$a_i(1 \leq a_i \leq 10^9)$。

#### 缩进风格

即缩进四个空格，也做为实现类似`<pre>`预格式化文本(Preformatted Text)的功能。

    Hello world!

预格式化文本：

    | First Header  | Second Header |
    | ------------- | ------------- |
    | Content Cell  | Content Cell  |
    | Content Cell  | Content Cell  |

#### JS 代码　

```javascript
function test() {
  console.log("Hello world!");
}

(function () {
  var box = function () {
    return box.fn.init();
  };

  box.prototype = box.fn = {
    init: function () {
      console.log("box.init()");

      return this;
    },

    add: function (str) {
      alert("add", str);

      return this;
    },

    remove: function (str) {
      alert("remove", str);

      return this;
    },
  };

  box.fn.init.prototype = box.fn;

  window.box = box;
})();

var testBox = box();
testBox.add("jQuery").remove("jQuery");
```

#### HTML 代码 HTML codes

```html
<!DOCTYPE html>
<html>
  <head>
    <mate charest="utf-8" />
    <title>Hello world!</title>
  </head>
  <body>
    <h1>Hello world!</h1>
  </body>
</html>
```

#### C++代码

```cpp
#include <bits/stdc++.h>
using namespace std;
using ll = long long;

#define dbg(x...) do { cout << "\033[32;1m" << #x << " -> "; err(x); } while (0)
void err() { cout << "\033[39;0m" << endl; }
template <class T, class... Ts> void err(const T& arg, const Ts&... args) { cout << arg << ' '; err(args...); }

const int mod = 1e9 + 7;
const int N = 5e3 + 10;
int n, S, B, f[N][N];

ll qpow(ll base, ll n) {
	ll res = 1;
	while (n) {
		if (n & 1) res = res * base % mod;
		base = base * base % mod;
		n >>= 1;
	}
	return res;
}

ll inv(ll x, ll mod) { return qpow(x, mod - 2); }

int main() {
	scanf("%d%d", &S, &B);
	n = B;
	memset(f, 0, sizeof f);
	for (int i = 0; i <= n; ++i) f[i][0] = 1, f[1][i] = 1;
	for (int i = 2; i <= n; ++i) {
		for (int j = 1; j < i; ++j) {
			f[i][j] = f[j][j];
		}
		for (int j = i; j <= n; ++j) {
			f[i][j] = (f[i - 1][j] + f[i][j - i]) % mod;
		}
	}
	ll res = 0;
	for (int i = 1; i < S; ++i) {
		for (int j = 0; j <= B - S; ++j) {
			dbg(i, j, S - i, B - S - j, f[i][j], f[S - i][B - S - j]);
			res += 1ll * f[i][j] * f[S - i][B - S - j] % mod;
			res %= mod;
		}
	}
	cout << res << endl;
	res += 2ll * f[S][B - S] % mod;
	res %= mod;
//	if ((B - S) % S == 0)
		res = (mod + res - S + 1) % mod;
		cout << res << endl;
	res = res * inv(2, mod) % mod;
//	res += 2ll * f[S][B - S] % mod;
	//cout << res << endl;
//	res = res * inv(S - 1, mod) % mod;
//	if ((B - S) % S == 0) res = (mod + res - 1) % mod;
//	cout << res << endl;
//	res %= mod;
//	cout << f[S][B - S] << endl;
//	res = (mod + res - 1) % mod;
	printf("%lld\n", res);
	return 0;
}


```

#### 文本

```plaintext
MathJax.Hub.Config({
    messageStyle: "none",
    config: ["MMLorHTML.js"],
    jax: ["input/TeX", "output/HTML-CSS", "output/NativeMML"],
    extensions: ["TeX/AMSmath.js", "TeX/AMSsymbols.js", "MathMenu.js", "MathZoom.js"]
});
```

### 图片 Images

Image:

> Follow your heart.

> 图为：厦门白城沙滩

图片加链接 (Image + Link)：

> 图为：李健首张专辑《似水流年》封面

---

### 列表 Lists

#### 无序列表（减号）Unordered Lists (-)

- 列表一
- 列表二
- 列表三

#### 无序列表（星号）Unordered Lists (\*)

- 列表一
- 列表二
- 列表三
-

$$
\begin{eqnarray}
f(x) = 2^x
\end{eqnarray}
$$

#### 无序列表（加号和嵌套）Unordered Lists (+)

- 列表一
- 列表二
  - 列表二-1
  - 列表二-2
  - 列表二-3
- 列表三
  - 列表一
  - 列表二
  - 列表三

#### 有序列表 Ordered Lists (-)

1. 第一行
2. 第二行
3. 第三行
4. $2^x$

#### GFM task list

- [x] GFM task list 1
- [x] GFM task list 2
- [ ] GFM task list 3
  - [ ] GFM task list 3-1
  - [ ] GFM task list 3-2
  - [ ] GFM task list 3-3
- [ ] GFM task list 4
  - [ ] GFM task list 4-1
  - [ ] GFM task list 4-2

---

### 绘制表格 Tables

| 项目   |  价格 | 数量 |
| ------ | ----: | :--: |
| 计算机 | $1600 |  5   |
| 手机   |   $12 |  12  |
| 管线   |    $1 | 234  |

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| First Header | Second Header |
| ------------ | ------------- |
| Content Cell | Content Cell  |
| Content Cell | Content Cell  |

| Function name | Description                |
| ------------- | -------------------------- |
| `help()`      | Display the help window.   |
| `destroy()`   | **Destroy your computer!** |

| Left-Aligned  | Center Aligned  | Right Aligned |
| :------------ | :-------------: | ------------: |
| col 3 is      | some wordy text |         $1600 |
| col 2 is      |    centered     |           $12 |
| zebra stripes |    are neat     |            $1 |

| Item     | Value |
| -------- | ----: |
| Computer | $1600 |
| Phone    |   $12 |
| Pipe     |    $1 |

---

#### 特殊符号 HTML Entities Codes

© & ¨ ™ ¡ £
& < > ¥ € ® ± ¶ § ¦ ¯ « ·

X² Y³ ¾ ¼ × ÷ »

18ºC " '

### Emoji 表情 :smiley:

> Blockquotes :star:

#### GFM task lists & Emoji & fontAwesome icon emoji & editormd logo emoji :editormd-logo-5x:

- [x] :smiley: @mentions, :smiley: #refs, [links](), **formatting**, and <del>tags</del> supported :editormd-logo:;
- [x] list syntax required (any unordered or ordered list supported) :editormd-logo-3x:;
- [x] [ ] :smiley: this is a complete item :smiley:;
- [ ] []this is an incomplete item [test link](#) :fa-star: @pandao;
- [ ] [ ]this is an incomplete item :fa-star: :fa-gear:;
  - [ ] :smiley: this is an incomplete item [test link](#) :fa-star: :fa-gear:;
  - [ ] :smiley: this is :fa-star: :fa-gear: an incomplete item [test link](#);

#### 反斜杠 Escape

\*literal asterisks\*

### 科学公式 TeX($\sum\limits_{i = 1}^n a_i$)

$$
E=mc^2
$$

行内的公式$E=mc^2$行内的公式，行内的$E=mc^2$公式。

$$
(\sqrt{3x-1}+(1+x)^2)
$$

$$
\sin(\alpha)^{\theta}=\sum\limits_{i=0}^{n}(x^i + \cos(f))
$$

多行公式：

$$
\left( \sum\limits_{k=1}^n a_k b_k \right)^2
\leq
\left( \sum\limits_{k=1}^n a_k^2 \right)
\left( \sum\limits_{k=1}^n b_k^2 \right)
$$

$$
\begin{eqnarray*}
f(x) = 2^x \mbox{(公式)}
\end{eqnarray*}
$$

$$
    \frac{1}{
        \Bigl(\sqrt{\phi \sqrt{5}}-\phi\Bigr) e^{
        \frac25 \pi}} = 1+\frac{e^{-2\pi}} {1+\frac{e^{-4\pi}} {
        1+\frac{e^{-6\pi}}
        {1+\frac{e^{-8\pi}}
         {1+\cdots} }
        }
    }
$$

$$
f(x) = \int_{-\infty}^\infty
    \hat f(\xi)\,e^{2 \pi i \xi x}
    \,d\xi
$$

### End

$$
f(n) =
\begin{cases}
n/2, & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}
\end{cases}
$$

$$
f(n) =
\begin{cases}
n/2, & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd} \end{cases}
$$

$$
\left\{
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\
a_2x+b_2y+c_2z=d_2 \\
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$

$$
X=\left( \begin{matrix} x_{11} & x_{12} & \cdots & x_{1d}\\ x_{21} & x_{22} & \cdots & x_{2d}\\ \vdots & \vdots & \ddots & \vdots\\ x_{m1} & x_{m2} & \cdots & x_{md}\\ \end{matrix} \right) =\left( \begin{matrix} x_1^T \\ x_2^T \\ \vdots\\ x_m^T \\ \end{matrix} \right)
$$

$$
\begin{align} \frac{\partial J(\theta)}{\partial\theta_j} & = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i)) \frac{\partial}{\partial\theta_j}(y^i-h_\theta(x^i)) \\ & = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i)) \frac{\partial}{\partial\theta_j}(\sum_{j=0}^n\theta_jx_j^i-y^i) \\ & = -\frac1m\sum_{i=0}^m(y^i-h_\theta(x^i))x^i_j \end{align}
$$

题目大意：有个一开始为空的序列。每次操作会往序列最后加一个 $1$ 到 $m$ 的随机整数。当整个序列的 $\gcd$ 为 $1$ 时停止。问这个序列的期望长度对 $10^9+7$ 取模的值。

$1\le m\le 10^5$。

首先很容易想到 DP：$f_i$ 表示目前的 $\gcd$ 为 $i$，期望还要多少次才能结束。

那么有 $f_1=0$。

转移，直接枚举即可：$f_i=1+\dfrac{1}{m}\sum\limits^m_{j=1}f_{\gcd(i,j)}$。

如果出现 $\gcd(i,j)=i$（也就是 $i|j$），那么把这种情况特殊判断，那么解个方程可以得到：

$$
f_i=\dfrac{1+\dfrac{1}{m}\sum\limits^m_{j=1,i | j}f_{\gcd(i,j)}}{1-\lfloor\frac{m}{i}\rfloor}
$$

答案为 $\dfrac{1}{m}\sum\limits^m_{i=1}(f_i+1)$。

这是 $O(m^2\log m)$ 的。我当时就是在这里卡住了，现在感觉自己是个 zz……

我们套路地枚举 $\gcd$，设 $c(i,j)$ 表示有多少个 $1\le x\le m$ 满足 $\gcd(i,x)=j$。那么就有：

$$
f_i=\dfrac{1+\dfrac{1}{m}\sum\limits_{j|i}f_{j}c(i,j)}{1-\lfloor\frac{m}{i}\rfloor}
$$

接下来就要考虑求 $c(i,j)(j|i)$。

$$
\begin{eqnarray*}
c(i,j)&=&\sum\limits^m_{x=1}[\gcd(i,x)=j] \\
&=&\sum\limits^m_{j|x}[\gcd(\frac{i}{j},\frac{x}{j})=1] \\
&=&\sum\limits^{\lfloor\frac{m}{j}\rfloor}_{x=1}[\gcd(\frac{i}{j},x)=1]
\end{eqnarray*}
$$

接下来有两条路可走：分解质因数（官方做法）和莫比乌斯反演（大众做法）。

那我们先来看看大众做法。

莫比乌斯反演：

$$
\begin{eqnarray*}
c(i,j) &=& \sum\limits^{\lfloor\frac{m}{j}\rfloor}_{x=1}\sum\limits_{d|\gcd(\frac{i}{j},x)}\mu(d) \\
&=& \sum\limits_{d|\frac{i}{j}}\mu(d)\sum\limits^{\lfloor\frac{m}{j}\rfloor}_{d|x}1 \\
&=& \sum\limits_{d|\frac{i}{j}}\mu(d)\lfloor\dfrac{m}{jd}\rfloor
\end{eqnarray*}
$$

此时求 $c(i,j)$ 复杂度为 $O(\sqrt{\frac{i}{j}})$。

总复杂度为

$$
O(\sum\limits^m_{i=2}\sum\limits_{j|i}\sqrt{\frac{i}{j}})=O(\sum\limits^m_{i=2}\sum\limits_{j|i}\sqrt{j})=O(\sum\limits^m_{j=1}\sqrt{j}\lfloor\frac{m}{j}\rfloor)\approx O(m\int^m_1j^{-\frac{1}{2}}\mathrm{d}j)=O(m\sqrt{m})
$$

分解质因数：
我们不妨修改一下定义（只是为了方便）：令 $c(x,y)=\sum\limits^y_{i=1}[\gcd(i,x)=1]$。那么原来的 $c(i,j)$ 就变成了现在的 $c(\frac{i}{j},\lfloor\frac{m}{j}\rfloor)$。

也就是要 $i$ 和 $x$ 的质因子集合没有交集。

我们从反向考虑，考虑与 $x$ 的质因子有交集的 $i$ 的个数。

先对 $x$ 质因数分解，设分解出的不同质因子有 $p_1,p_2\cdots p_k$。那么有 $k\le 6$。

那么与集合 $S$ 有交的 $i$ 的个数就是 $\displaystyle \lfloor\frac{y}{\prod S_i}\rfloor$。

然后还要再容斥一下。那么总的就是：

$$
c(x,y)=y-\sum\limits_{S\in x_{pr}}(-1)^{|S|}\lfloor\frac{y}{\prod S_i}\rfloor
$$

此时转移方程为：

$$
f_i=\dfrac{1+\dfrac{1}{m}\sum\limits_{j|i}f_{j}c(\frac{i}{j},\lfloor\frac{m}{j}\rfloor)}{1-\lfloor\frac{m}{i}\rfloor}
$$

这个可以做到 $O(2^k+\sqrt{x})$。注意最好用 DFS，不要用二进制枚举，否则会退化为 $O(2^k\times k+\sqrt{x})$。（虽然也能过）

时间复杂度也是 $O(m\sqrt{m})$。

<div>
<div class="article-entry marked-body" itemprop="articleBody">
      
        <p>最近准备面试，把最近复习的内容记录一下吧</p>
<h1 id="计算机网络"><a href="#计算机网络" class="headerlink" title="计算机网络"></a>计算机网络</h1><h2 id="OSI七层模型"><a href="#OSI七层模型" class="headerlink" title="OSI七层模型"></a>OSI七层模型</h2><ul>
<li>应用层<br>网络服务与最终用户的一个接口。<br>协议有：HTTP FTP TFTP SMTP SNMP DNS TELNET HTTPS POP3 DHCP</li>
<li>表示层<br>数据的表示、安全、压缩。（在五层模型里面已经合并到了应用层）<br>格式有，JPEG、ASCll、EBCDIC、加密格式等 [2] </li>
<li>会话层<br>建立、管理、终止会话。（在五层模型里面已经合并到了应用层）<br>对应主机进程，指本地主机与远程主机正在进行的会话</li>
<li>传输层<br>定义传输数据的协议端口号，以及流控和差错校验。<br>协议有：TCP UDP，数据包一旦离开网卡即进入网络传输层</li>
<li>网络层<br>进行逻辑地址寻址，实现不同网络之间的路径选择。<br>协议有：ICMP IGMP IP（IPV4 IPV6）</li>
<li>数据链路层<br>建立逻辑连接、进行硬件地址寻址、差错校验 [3]  等功能。（由底层网络定义协议）<br>将比特组合成字节进而组合成帧，用MAC地址访问介质，错误发现但不能纠正。</li>
<li>物理层<br>建立、维护、断开物理连接。（由底层网络定义协议）</li>
</ul>
<h2 id="TCP-和UDP的区别"><a href="#TCP-和UDP的区别" class="headerlink" title="TCP 和UDP的区别"></a>TCP 和UDP的区别</h2><ul>
<li>TCP是面向连接的， UDP是面向非连接的，即发送数据前不需要建立连接</li>
<li>TCP提供可靠服务（数据传输），UDP不能保证</li>
<li>TCP面向字节流， UDP面向报文</li>
<li>TCP数据传输慢， UDP数据传输快</li>
</ul>
<h2 id="浏览器输入网址后"><a href="#浏览器输入网址后" class="headerlink" title="浏览器输入网址后"></a>浏览器输入网址后</h2><ol>
<li>查找域名对应的IP地址，依次查找浏览器缓存，系统缓存，路由器缓存，ISPNDS缓存，根域名服务器</li>
<li>浏览器向IP对应的WEB服务器发送一个HTTP请求</li>
<li>服务器相应请求，发回网页内容</li>
<li>浏览器解析网页内容</li>
</ol>
<h2 id="GET和POST的区别"><a href="#GET和POST的区别" class="headerlink" title="GET和POST的区别"></a>GET和POST的区别</h2><ul>
<li>从原理上看<ul>
<li>GET用于信息获取，而且是安全和幂等的</li>
<li>POST请求表示可能修改服务器上资源和请求</li>
</ul>
</li>
<li>从表面上看<ul>
<li>GET请求的数据会附在URL后面，POST的数据放在HTTP包内</li>
<li>POST安全性高于GET</li>
</ul>
</li>
</ul>
<h2 id="TCP三次握手和四次挥手"><a href="#TCP三次握手和四次挥手" class="headerlink" title="TCP三次握手和四次挥手"></a>TCP三次握手和四次挥手</h2><p>SYN 1/0 表示是否为新建立的连接</p>
<p>ACK 1/0 确认信息</p>
<h3 id="三次握手"><a href="#三次握手" class="headerlink" title="三次握手"></a>三次握手</h3><ol>
<li>client请求建立连接，将SYN置为1， 从client发向server</li>
<li>server回应确认信息，SYN=1,ACK=1，表示server确认能收到client的请求， 从server发向client</li>
<li>client回应server的确认信息，ACK=1，表示client能收到server的请求，从client发现server</li>
</ol>
<h3 id="四次挥手"><a href="#四次挥手" class="headerlink" title="四次挥手"></a>四次挥手</h3><ol>
<li>client请求断开，FIN=1, 从client发向server</li>
<li>server确认收到，ACK=1，从server发向client</li>
<li>server请求断开，FIN=1，从server发现client</li>
<li>client确认收到，ACK=1，从client发现srever</li>
</ol>
<figure class="highlight plain"><table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">不能三次挥手的原因为client请求断开的时候只是代表client已经将全部数据发向server，却不能代表server的数据已经全部发向client了</span><br></pre></td></tr></tbody></table></figure>
<h1 id="数据库"><a href="#数据库" class="headerlink" title="数据库"></a>数据库</h1><h2 id="存储过程"><a href="#存储过程" class="headerlink" title="存储过程"></a>存储过程</h2><ul>
<li>定义：存储过程是一些预编译的SQL语句</li>
<li>好处：<ul>
<li>由于数据库执行动作时，是先编译后执行的。然而存储过程是一个编译过的代码块，所以执行效率要比T-SQL语句高。</li>
<li>一个存储过程在程序在网络中交互时可以替代大堆的T-SQL语句，所以也能降低网络的通信量，提高通信速率。</li>
<li>通过存储过程能够使没有权限的用户在控制之下间接地存取数据库，从而确保数据的安全。</li>
</ul>
</li>
</ul>
<h2 id="事务"><a href="#事务" class="headerlink" title="事务"></a>事务</h2><ul>
<li>定义：事务是并发的基本单位，是一个操作序列，是不可分割的工作单位。事务是数据库维护数据一致性的单位，在每个事务结束时，都能保持数据一致性。</li>
</ul>
<h2 id="四个特征"><a href="#四个特征" class="headerlink" title="四个特征"></a>四个特征</h2><ul>
<li>A：atomicity（原子性）<ul>
<li>一个事务要么全部实现成功，要么全部失败后回滚</li>
</ul>
</li>
<li>c: consistency（一致性）<ul>
<li>事务的执行不能破坏数据库数据的完整性和一致性，一个事务在执行之前和执行之后，数据库都必须处于一致性状态</li>
<li>从一个正确状态迁移到另一个正确状态，例如银行转账前后余额不能为负数</li>
</ul>
</li>
<li>I：isolation（隔离性）<ul>
<li>事务的隔离性是指在并发环境中，并发的事务时相互隔离的，一个事务的执行不能不被其他事务干扰。</li>
</ul>
</li>
<li>D：durability（持久性）<ul>
<li>一旦事务提交，那么它对数据库中的对应数据的状态的变更就会永久保存到数据库中。即使发生系统崩溃或机器宕机等故障，只要数据库能够重新启动，那么一定能够将其恢复到事务成功结束的状态</li>
</ul>
</li>
</ul>
<h2 id="数据索引"><a href="#数据索引" class="headerlink" title="数据索引"></a>数据索引</h2><ul>
<li>索引的存储结构 = { 1. Hash表 2. B+树 }<ul>
<li>hash 索引的实现<br>底层数据结构 = hash表<br>通过hash值定位数据行，产生碰撞则采用拉链法解决</li>
<li>hash索引的缺点 <ol>
<li>适用于等值查询。<br>但hash索引无法排序，因此不适用于范围查询，不支持最左匹配原则。</li>
<li>大量重复的键值，减低效率、</li>
</ol>
</li>
</ul>
</li>
<li>分类：普通索引，唯一索引，主键索引，全文索引</li>
<li>定义：对数据库表中一或多个列的值进行排序的结构，是帮助MySQL高效获取数据的数据结构</li>
<li>作用<ul>
<li>索引加快数据库的检索速度</li>
<li>索引降低了插入、删除、修改等维护任务的速度</li>
<li>唯一索引可以确保每一行数据的唯一性</li>
<li>通过使用索引，可以在查询的过程中使用优化隐藏器，提高系统的性能</li>
<li>索引需要占物理和数据空间</li>
</ul>
</li>
</ul>
<h3 id="聚集索引和非聚集索引"><a href="#聚集索引和非聚集索引" class="headerlink" title="聚集索引和非聚集索引"></a>聚集索引和非聚集索引</h3><ul>
<li>聚集索引一个表只能有一个，而非聚集索引一个表可以有多个</li>
<li>聚集索引存储记录是物理上连续存在，而非聚集索引是逻辑上的连续，物理存储并不连续</li>
<li>聚集索引：物理存储按照索引排序；聚集索引是一种索引组织形式，索引的键值逻辑顺序决定了表数据行的物理存储顺序</li>
<li>索引是通过二叉树的数据结构来描述的，我们可以这么理解聚簇索引：索引的叶节点就是数据节点。而非聚簇索引的叶节点仍然是索引节点，只不过有一个指针指向对应的数据块。</li>
<li>聚集索引在叶节点存的是行数据，而非聚集索引存的是一个指针</li>
</ul>
<h3 id="普通索引和唯一索引"><a href="#普通索引和唯一索引" class="headerlink" title="普通索引和唯一索引"></a>普通索引和唯一索引</h3><ul>
<li>唯一索引保证了数据的唯一性</li>
</ul>
<h4 id="查询过程"><a href="#查询过程" class="headerlink" title="查询过程"></a>查询过程</h4><ul>
<li>对于普通索引而言，找到一行数据后会查找下一个，直到下一个不符合</li>
<li>对于唯一索引而言，找到一行数据后就会停止，并不会查找下一个</li>
</ul>
<figure class="highlight plain"><table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">但是二者查找效率差不多</span><br></pre></td></tr></tbody></table></figure>
<h4 id="更新过程"><a href="#更新过程" class="headerlink" title="更新过程"></a>更新过程</h4><ul>
<li><p>change buffer</p>
<ul>
<li>在正常情况下先将更新操作写入到change buffer中，在下次读取到需要更新的数据页的时候再进行merge，同时数据库后台会定期将change buffer进行merge，在数据库关闭的时候也会进行change merge</li>
<li>change buffer可以减少读取磁盘的数据，使得效率提到，但是会占据buffer pool，所以这种唱法是通过空间换取时间</li>
</ul>
</li>
<li><p>对于普通索引而言，每次更新都会先将更新数据写入到change buffer中</p>
</li>
<li>对于唯一索引而言，由于每次更新操作都需要判断是否唯一，所以会立即提交更新，从而保证数据的唯一性</li>
</ul>
<h3 id="普通索引和主键索引"><a href="#普通索引和主键索引" class="headerlink" title="普通索引和主键索引"></a>普通索引和主键索引</h3><ul>
<li>主键索引在B树中叶子节点存的是行数据</li>
<li>非主键索引在B书中叶子节点存的是主键，是二级索引</li>
</ul>
<h3 id="全文索引"><a href="#全文索引" class="headerlink" title="全文索引"></a>全文索引</h3><ul>
<li>原理：定义一个词库，然后在文章中查找每个词条出现的频率和位置，吧这样的频率和位置信息按照词库的为顺序归纳</li>
<li>问题<ul>
<li>中文中间无空格，所以无法判断是否是一个单词</li>
<li>方法<ul>
<li>二元法：把所有有可能的每凉凉汉子的组合看为一个词组，这样就没有维护词库的开销</li>
<li>词库发：维护一个词库</li>
</ul>
</li>
</ul>
</li>
<li>适用范围<ul>
<li>只适用于char、varchar、text</li>
</ul>
</li>
</ul>
<h3 id="什么时候需要建索引，什么时候不需要？"><a href="#什么时候需要建索引，什么时候不需要？" class="headerlink" title="什么时候需要建索引，什么时候不需要？"></a>什么时候需要建索引，什么时候不需要？</h3><ul>
<li><p>什么时候要索引？</p>
<ol>
<li>表的主键、外键必须有索引</li>
<li>数据量超过300必须有索引</li>
<li>经常与其他表进行连接的表，在连接字段上建立索引</li>
<li>经常出现在where子句的字段，特别是大表字段，必须建索引</li>
<li>索引应建立在小字段上，对于大文本字段甚至超长字段，不要建索引</li>
</ol>
</li>
<li><p>什么时候不需要索引？</p>
<ol>
<li>建立组合索引，但查询谓词并未使用组合索引第一列，此时索引也是无效的</li>
<li>在包含有null值的table列上建索引，使用select count(*) from table时不会使用索引</li>
<li>在索引列上使用函数不会使用索引，除非新建函数索引</li>
<li>被索引的列进行隐式类型转换时不会使用索引</li>
<li>当查询数据量占整个表比重大时，full scan table采用多块读查询更快</li>
</ol>
</li>
</ul>
<h2 id="并发事务带来的问题"><a href="#并发事务带来的问题" class="headerlink" title="并发事务带来的问题"></a>并发事务带来的问题</h2><ol>
<li><p>脏读</p>
<pre><code> 事务A 修改数据，但并未commit。而事务B读取该数据。 
</code></pre><p> ​    把数据库的事务隔离级别调整到READ_COMMITTED（读提交/不可重复读）</p>
<p> ​    让用户在更新时锁定数据库，阻止其他用户读取，直到更新全部完成才让你读取。</p>
</li>
<li><p>丢失修改</p>
<pre><code> 事务A 、B都读取同一个数据。事务A 、B先后修改数据，则 第一次修改操作丢失。
</code></pre><p> ​    通过上锁，乐观锁</p>
</li>
<li><p>不可重复读</p>
<pre><code> 事务A 共读取两次数据，而在这两次读取之间。事务B修改了数据。则事务A两次读取到的数据不同。
</code></pre><p> ​    把数据库的事务隔离级别调整到REPEATABLE_READ（可重复读）</p>
<p> ​    一个事务里，对数据的多次查询都是读取的一个，无论该数据在中途是否被其他事务修改过，因此也就避免了不可重复读的问题。</p>
</li>
<li><p>幻读</p>
<pre><code> 事务A 读取【n行数据】,事务B在n行数据间添加数据。则事务A第二次读取时，读取到n+1行。
</code></pre><p> ​    把数据库的事务隔离级别调整到SERIALIZABLE_READ（序列化执行），或者数据库使用者自己进行加锁来保证</p>
<p> ​    Repeatable read及以上级别通过间隙锁来防止幻读的出现，即锁定特定数据的前后间隙让数据无法被插入</p>
</li>
</ol>
<h2 id="乐观锁和悲观锁"><a href="#乐观锁和悲观锁" class="headerlink" title="乐观锁和悲观锁"></a>乐观锁和悲观锁</h2><ul>
<li>数据库管理系统（DBMS）中的并发控制的任务是确保在多个事务同时存取数据库中同一数据时不破坏事务的隔离性和统一性以及数据库的统一性。</li>
</ul>
<h3 id="悲观锁"><a href="#悲观锁" class="headerlink" title="悲观锁"></a>悲观锁</h3><ul>
<li>悲观锁【通过阻塞机制】实现</li>
<li>假定会发生并发冲突，屏蔽一切可能违反数据完整性的操作</li>
<li>对数据被外界修改持有悲观态度，在数据处理的时候会将整个数据上锁</li>
<li>流程<ul>
<li>对任意数据修改前，先尝试为该记录加上排他锁</li>
<li>如果加锁失败，说明该记录正在被修改，那么当前查询可能要等待或者抛出异常。 具体响应方式由开发者根据实际需要决定。</li>
<li>如果成功加锁，那么就可以对记录做修改，事务完成后就会解锁了。</li>
<li>其间如果有其他对该记录做修改或加排他锁的操作，都会等待我们解锁或直接抛出异常。</li>
</ul>
</li>
<li>要使用悲观锁，我们必须关闭mysql数据库的自动提交属性，因为MySQL默认使用autocommit模式，也就是说，当你执行一个更新操作后，MySQL会立刻将结果进行提交。</li>
<li>注意：MySQL InnoDB默认行级锁。行级锁都是基于索引的，如果一条SQL语句用不到索引是不会使用行级锁的，会使用表级锁把整张表锁住，这点需要注意。</li>
<li>优点和不足<ul>
<li>优点：悲观并发控制实际上是“先取锁再访问”的保守策略，为数据处理的安全提供了保证。</li>
<li>缺点：<ol>
<li>在效率方面，处理加锁的机制会让数据库产生额外的开销，还有增加产生死锁的机会；</li>
<li>在只读型事务处理中由于不会产生冲突，也没必要使用锁，这样做只能增加系统负载；</li>
<li>会降低了并行性，一个事务如果锁定了某行数据，其他事务就必须等待该事务处理完才可以处理那行数</li>
</ol>
</li>
</ul>
</li>
</ul>
<h3 id="乐观锁"><a href="#乐观锁" class="headerlink" title="乐观锁"></a>乐观锁</h3><ul>
<li>乐观锁通过【回滚重试】实现</li>
<li>假设不会发生并发冲突，只在提交操作时检查是否违反数据完整性。</li>
<li>在提交数据更新之前，每个事务会先检查在该事务读取数据后，有没有其他事务又修改了该数据。如果其他事务有更新的话，正在提交的事务会进行回滚。</li>
<li><p>一般的实现乐观锁的方式就是记录数据版本。</p>
<ul>
<li>数据版本,为数据增加的一个版本标识。当读取数据时，将版本标识的值一同读出，数据每更新一次，同时对版本标识进行更新。</li>
<li>当我们提交更新的时候，判断数据库表对应记录的当前版本信息与第一次取出来的版本标识进行比对，如果数据库表当前版本号与第一次取出来的版本标识值相等，则予以更新，否则认为是过期数据。</li>
<li>实现数据版本有两种方式，第一种是使用版本号，第二种是使用时间戳。</li>
</ul>
</li>
<li><p>优点与不足</p>
<ul>
<li>优点：效率高，不会产生任何锁和死锁。</li>
<li>缺点：如果直接简单这么做，还是有可能会遇到不可预期的结果，例如两个事务都读取了数据库的某一行，经过修改以后写回数据库，这时就遇到了问题。</li>
</ul>
</li>
</ul>
<h2 id="drop、delete、truncate"><a href="#drop、delete、truncate" class="headerlink" title="drop、delete、truncate"></a>drop、delete、truncate</h2><ul>
<li>drop是删除表，truncate保留表但是删除表数据，delete可以删除部分数据（用where）</li>
<li>delete、truncate只删除表数据不会删除表结构，而drop会删除表结构</li>
<li>在效率方面：drop &gt; truncate &gt; delete</li>
<li>delete是DML，会将这个操作放在rollback segment里面，事务提交之后才生效，如果有对应的trigger会出发trigger</li>
<li>truncate是DDL，会立即执行操作，原数据并不会放在rollback segment里面，不能回滚，操作也不会触发triggle</li>
<li>truncate只能删除table，delete可以删除table和view</li>
</ul>
<h2 id="超键、候选键、主键、外键分别是什么？"><a href="#超键、候选键、主键、外键分别是什么？" class="headerlink" title="超键、候选键、主键、外键分别是什么？"></a>超键、候选键、主键、外键分别是什么？</h2><ul>
<li>超键：在关系中能唯一标识元组的属性集称为关系模式的超键。一个属性可以为作为一个超键，多个属性组合在一起也可以作为一个超键。超键包含候选键和主键</li>
<li>候选键：是最小超键，即没有冗余元素的超键</li>
<li>主键：数据库表中对储存数据对象予以唯一和完整标识的数据列或属性的组合。一个数据列只能有一个主键，且主键的取值不能缺失，即不能为空值（Null）</li>
<li>外键：在一个表中存在的另一个表的主键称此表的外键</li>
</ul>
<h2 id="view视图"><a href="#view视图" class="headerlink" title="view视图"></a>view视图</h2><ul>
<li>视图是一种虚拟的表，具有和物理表相同的功能。可以对视图进行增，改，查，操作，试图通常是有一个表或者多个表的行或列的子集。对视图的修改会影响基本表。它使得我们获取数据更容易，相比多表查询。</li>
<li>只暴露部分字段给访问者，所以就建一个虚表，就是视图。</li>
<li>查询的数据来源于不同的表，而查询者希望以统一的方式查询，这样也可以建立一个视图，把多个表查询结果联合起来，查询者只需要直接从视图中获取数据，不必考虑数据来源于不同表所带来的差异</li>
</ul>
<h2 id="范式"><a href="#范式" class="headerlink" title="范式"></a>范式</h2><ul>
<li>第一范式（1NF）：数据库表中的字段都是单一属性的，不可再分。这个单一属性由基本类型构成，包括整型、实数、字符型、逻辑型、日期型等。</li>
<li>第二范式（2NF）：数据库表中不存在非关键字段对任一候选关键字段的部分函数依赖（部分函数依赖指的是存在组合关键字中的某些字段决定非关键字段的情况），也即所有非关键字段都完全依赖于任意一组候选关键字。</li>
<li>第三范式（3NF）：在第二范式的基础上，数据表中如果不存在非关键字段对任一候选关键字段的传递函数依赖则符合第三范式。所谓传递函数依赖，指的是如 果存在”A → B → C”的决定关系，则C传递函数依赖于A。因此，满足第三范式的数据库表应该不存在如下依赖关系： 关键字段 → 非关键字段 x → 非关键字段y</li>
</ul>
<h2 id="B树和B-树"><a href="#B树和B-树" class="headerlink" title="B树和B+树"></a>B树和B+树</h2><h3 id="B树"><a href="#B树" class="headerlink" title="B树"></a>B树</h3><ul>
<li>概念<ul>
<li>每个节点最多有m-1个<strong>关键字</strong>（可以存有的键值对）。</li>
<li>根节点最少可以只有1个<strong>关键字</strong>。</li>
<li>非根节点至少有m/2个<strong>关键字</strong>。</li>
<li>每个节点中的关键字都按照从小到大的顺序排列，每个关键字的左子树中的所有关键字都小于它，而右子树中的所有关键字都大于它。</li>
<li>所有叶子节点都位于同一层，或者说根节点到每个叶子节点的长度都相同。</li>
<li>每个节点都存有索引和数据，也就是对应的key和value。</li>
</ul>
</li>
</ul>
<h3 id="B-树"><a href="#B-树" class="headerlink" title="B+树"></a>B+树</h3><ul>
<li>概念<ul>
<li>相同点<ul>
<li>根节点至少一个元素</li>
<li>非根节点元素范围：m/2 &lt;= k &lt;= m-1</li>
</ul>
</li>
<li>不同点<ul>
<li>B+树有两种类型的节点：内部结点（也称索引结点）和叶子结点。内部节点就是非叶子节点，内部节点不存储数据，只存储索引，数据都存储在叶子节点。</li>
<li>内部结点中的key都按照从小到大的顺序排列，对于内部结点中的一个key，左树中的所有key都小于它，右子树中的key都大于等于它。叶子结点中的记录也按照key的大小排列。</li>
<li>每个叶子结点都存有相邻叶子结点的指针，叶子结点本身依关键字的大小自小而大顺序链接。</li>
<li>父节点存有右孩子的第一个元素的索引。</li>
</ul>
</li>
</ul>
</li>
</ul>
<h3 id="B-树优点"><a href="#B-树优点" class="headerlink" title="B+树优点"></a>B+树优点</h3><p>B+树相对于B树有一些自己的优势，可以归结为下面几点。</p>
<ul>
<li>单一节点存储的元素更多，使得查询的IO次数更少，所以也就使得它更适合做为数据库MySQL的底层数据结构了。</li>
<li>所有的查询都要查找到叶子节点，查询性能是稳定的，而B树，每个节点都可以查找到数据，所以不稳定。</li>
<li>所有的叶子节点形成了一个有序链表，更加便于查找。</li>
</ul>
<h1 id="操作系统"><a href="#操作系统" class="headerlink" title="操作系统"></a>操作系统</h1><h2 id="进程"><a href="#进程" class="headerlink" title="进程"></a>进程</h2><ul>
<li>fork的时候是用的copy on write，父进程和子进程共用一个物理空间，只有当需要修改的时候才会copy物理空间，从而使得fork的时候快</li>
<li>父进程需要等子进程退出后才能释放，因为子进程的PCB需要父进程来释放</li>
<li>特点<ul>
<li>动态性：可动态地创建、结束进程</li>
<li>并发性：进程可以被独立调度并占用处理机运行；</li>
<li>独立性：不同进程的工作不相互影响</li>
<li>制约性：因访问共享数据/资源或进程间同步而产生制约</li>
</ul>
</li>
<li>调度算法<ul>
<li>FCFS先来先服务，first come first server<ul>
<li>优点<ol>
<li>简单</li>
</ol>
</li>
<li>缺点<ol>
<li>平均等待时间波动大</li>
<li>花费时间少的任务可能排在花费时间长的任务后面</li>
<li>可能导致I/O和CPU之间的重叠处理</li>
</ol>
</li>
</ul>
</li>
<li>SPN 短作业优先 时间越短越先服务（分为可抢占和非抢占）<ul>
<li>可能导致饥饿，连续的短任务使得长任务饥饿，短任务可用时的任何长任务的CPU时间都会增加平均等待时间</li>
<li>需要预知未来，需要知道执行时间</li>
<li>不公平，但是平均等待时间最小</li>
</ul>
</li>
<li>HRRN 最高响应比优先<ul>
<li>根据R=(w+s)/s, w:waiting time, s:server time</li>
<li>不可抢占</li>
</ul>
</li>
<li>Round Robin 轮询<ul>
<li>轮流占用CPU，每个进程每次只占用一个时间片长度的时间</li>
<li>需要较多的上下文切换开销</li>
<li>时间片大会退化成FCFS，时间片小会使得上下文切换过多</li>
<li>公平，但是平均等待时间长</li>
</ul>
</li>
<li>Multilevel Feedback Queues 多级反馈队列<ul>
<li>将进程分为多个队列，对于不同的队列采取不同的调度算法</li>
</ul>
</li>
<li>Fair Share Scheduling 公平共享调度<ul>
<li>对用户的公平</li>
</ul>
</li>
</ul>
</li>
</ul>
<h2 id="线程"><a href="#线程" class="headerlink" title="线程"></a>线程</h2><ul>
<li>优点<ul>
<li>一个进程可以同时存在多个线程</li>
<li>各个线程之间可以并发的执行</li>
<li>各个进程之间可以共享地址空间和文件等资源</li>
</ul>
</li>
<li>缺点<ul>
<li>一个线程崩溃，会导致其所属进程的所有线程崩溃</li>
</ul>
</li>
</ul>
<h2 id="进程和程序的区别"><a href="#进程和程序的区别" class="headerlink" title="进程和程序的区别"></a>进程和程序的区别</h2><ul>
<li>进程是动态的，程序是静态的：程序是有序代码的集合；进程是程序的执行，进程有核心态/用户态</li>
<li>进程是暂时的，程序是永久的：进程是一个状态变化的过程，程序可长久保存</li>
<li>进程与程序的组成不同：进程的组成包括程序、数据和进程控制快（即进程状态信息）</li>
</ul>
<h2 id="进程和线程以及它们的区别"><a href="#进程和线程以及它们的区别" class="headerlink" title="进程和线程以及它们的区别"></a>进程和线程以及它们的区别</h2><ul>
<li>进程是具有一定功能的程序关于某个数据集合上的一次运行活动，进程是系统进行资源调度和分配的一个独立单位。</li>
<li>线程是进程的实体，是CPU调度和分派的基本单位，它是比进程更小的能独立运行的基本单位。</li>
<li>一个进程可以有多个线程，多个线程也可以并发执行</li>
<li>线程讲究效率，进程可以讲究安全</li>
</ul>
<h2 id="线程与进程的比较"><a href="#线程与进程的比较" class="headerlink" title="线程与进程的比较"></a>线程与进程的比较</h2><ul>
<li>进程是资源分配单位，线程是CPU调度单位</li>
<li>进程拥有一个完整的资源平台，而线程只独享必不可少的资源，如寄存器和栈</li>
<li>线程同样具有就绪、阻塞和执行三种基本状态，同样具有状态之间的转换关系</li>
<li>线程能减少并发执行的时间和空间开销：<ul>
<li>线程创建时间比进程短</li>
<li>线程终止时间比进程短</li>
<li>统一进程内的线程切换比进程短</li>
<li>由于统一进程的各线程共享内存和文件资源，可直接进行不通过内核的通信</li>
</ul>
</li>
</ul>
<h2 id="虚拟内存"><a href="#虚拟内存" class="headerlink" title="虚拟内存"></a>虚拟内存</h2><h3 id="前言"><a href="#前言" class="headerlink" title="前言"></a>前言</h3><ul>
<li><p>内存不够的时候的方法<br>1.覆盖：程序内进行交换，统一块内存可以由多个函数分时执行</p>
<ul>
<li>优点：内存占用小</li>
<li>缺点：<ul>
<li>设计者需要设计若干个互不相关的模块，麻烦</li>
</ul>
</li>
<li>增加磁盘IO次数，效率低</li>
</ul>
<p>2.交换：让运行中或者需要运行的程序获得内存，将暂时不运行的保存在外存中</p>
<ul>
<li>问题<ol>
<li>时机</li>
<li>大小</li>
<li>重定位</li>
</ol>
</li>
</ul>
</li>
<li>数据的局部性<ul>
<li>时间局部性：短时间内被引用过一次的存储器位置在未来会被多次引用</li>
<li>空间局部性：如果一个存储器的位置被引用，那么将来他附近的位置也会被引用</li>
</ul>
</li>
</ul>
<h3 id="虚拟技术"><a href="#虚拟技术" class="headerlink" title="虚拟技术"></a>虚拟技术</h3><ul>
<li>特点<ul>
<li>内存大：虚拟内存的大小=物理内存+硬盘大小</li>
<li>部分交换：所以效率高</li>
<li>不连续</li>
</ul>
</li>
<li>通过访问异常机制，catch到异常后从磁盘中找数据</li>
<li>页表<ul>
<li>驻留位：是否在内存中</li>
<li>保护位：对这部分空间的访问权限（WR）</li>
<li>修改位：是否修改（若修改，将这页淘汰的时候需要将数据写入到磁盘中）</li>
<li>访问位：是否访问过</li>
</ul>
</li>
<li>计算公式<ul>
<li>EAT=访问内存时间<em>页表命中率+访问内存时间</em>页表未命中率*（1 + 写入磁盘的概率）</li>
</ul>
</li>
<li>访问过程<ol>
<li>查页表，如果存在则直接读取，如果不在则执行2</li>
<li>如果存在空闲页位置，则直接写入，如果不存在则执行3</li>
<li>找页置换，如果没有修改则直接清空，如果有修改需要先写入到磁盘中在清空</li>
</ol>
</li>
</ul>
<h3 id="页面置换算法"><a href="#页面置换算法" class="headerlink" title="页面置换算法"></a>页面置换算法</h3><ul>
<li>最优页面置换：将当前之后最长时间没用到的页作为置换页，但是因为无法预先知道调用顺序，。是一种保证最少的缺页率的理想化算法</li>
<li>FIFO（先进先出）：淘汰最先进入的页</li>
<li>LRU（最近最少使用）：将最久未使用的页面作为置换页，该算法根据时间局部性\<br>需要记录时间顺序，因此开销大，常用的方法为1. 维护页面链表 2.设置一个活动页面栈</li>
<li>clock(时间页面置换)：和LRU相似，对FIFO改进\<br>组成一个环形链表，每次将访问的页面的used设置为1，指针不断顺时针旋转，如果遇到used为1的则将used设置为0，否则将其作为淘汰也</li>
<li><p>二次机会算法：对clock的改进，用到了dirty bit和used bit\<br>减少了写入页换出的概率，从而减少写入磁盘的次数，减少IO开销\<br>| used before | dirty before | used after | dirty after |<br>| —————- | —————— | ————— | —————- |<br>| 0           | 0            | replaced   | replaced    |<br>| 0           | 1            | 0          | 0           |<br>| 1           | 0            | 0          | 0           |<br>| 1           | 1            | 0          | 1           |</p>
</li>
<li><p>LFU(最不常用算法)：将访问次数越少的淘汰掉，但是开销大</p>
</li>
</ul>
<figure class="highlight plain"><table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><span class="line">在所有页面均为访问的情况下，LRU和clock算法会退化成FIFO算法</span><br></pre></td></tr></tbody></table></figure>
<h4 id="Belady问题"><a href="#Belady问题" class="headerlink" title="Belady问题"></a>Belady问题</h4><ul>
<li>FIFO页面置换算法的时候，会出出现物理页越多，缺页率越高的情况<br>例如:<br>访问顺序：1, 2, 3, 4, 1, 2, 5, 1, 2, 3, 4, 5<br>page size为别为3和4的时候</li>
</ul>
<h2 id="死锁"><a href="#死锁" class="headerlink" title="死锁"></a>死锁</h2><ul>
<li>定义：在两个或者多个并发进程中，如果每个进程持有某种资源而又等待其它进程释放它或它们现在保持着的资源，在未改变这种状态之前都不能向前推进，称这一组进程产生了死锁</li>
<li>产生条件<ul>
<li>互斥条件：一个资源一次只能被一个进程使用</li>
<li>占用并等待：一个进程因请求资源而阻塞时，对已获得资源保持不放</li>
<li>非抢占：进程获得的资源，在未完全使用完之前，不能强行剥夺</li>
<li>循环等待条件：若干进程之间形成一种头尾相接的环形等待资源关系</li>
</ul>
</li>
<li>预防方法<ul>
<li>资源一次性分配：一次性分配所有资源，这样就不会再有请求了：（破坏请求条件）</li>
<li>只要有一个资源得不到分配，也不给这个进程分配其他的资源：（破坏请保持条件）</li>
<li>可剥夺资源：即当某进程获得了部分资源，但得不到其它资源，则释放已占有的资源（破坏不可剥夺条件）</li>
<li>资源有序分配法：系统给每类资源赋予一个编号，每一个进程按编号递增的顺序请求资源，释放则相反（破坏环路等待条件）</li>
</ul>
</li>
</ul>
<h2 id="锁"><a href="#锁" class="headerlink" title="锁"></a>锁</h2><ul>
<li>锁模式 描述  <ul>
<li>从数据库系统的角度来看：分为独占锁（即排它锁），共享锁和更新锁  </li>
<li>共享 (S) ：读锁，用于不更改或不更新数据的操作（只读操作），如 SELECT 语句。  </li>
<li>更新 (U) ：(介于共享和排它锁之间），可以让其他程序在不加锁的条件下读，但本程序可以随时更改。</li>
<li>排它 (X)：写锁。 用于数据修改操作，例如 INSERT、UPDATE 或 DELETE。确保不会同时同一资源进行多重更新</li>
</ul>
</li>
<li>共享锁<br>共享 (S) 锁允许并发事务读取 (SELECT) 一个资源。资源上存在共享 (S) 锁时，任何其它事务都不能修改数据。一旦已经读取数据，便立即释放资源上的共享 (S) 锁，除非将事务隔离级别设置为可重复读或更高级别，或者在事务生存周期内用锁定提示保留共享 (S) 锁。  </li>
<li>更新锁<br>更新 (U) 锁可以防止通常形式的死锁。一般更新模式由一个事务组成，此事务读取记录，获取资源（页或行）的共享 (S) 锁，然后修改行，此操作要求锁转换为排它 (X) 锁。如果两个事务获得了资源上的共享模式锁，然后试图同时更新数据，则一个事务尝试将锁转换为排它 (X) 锁。共享模式到排它锁的转换必须等待一段时间，因为一个事务的排它锁与其它事务的共享模式锁不兼容；发生锁等待。第二个事务试图获取排它 (X) 锁以进行更新。由于两个事务都要转换为排它 (X) 锁，并且每个事务都等待另一个事务释放共享模式锁，因此发生死锁。  </li>
<li>排它锁<br>排它 (X) 锁可以防止并发事务对资源进行访问。其它事务不能读取或修改排它 (X) 锁锁定的数据。  </li>
<li>意向锁<br>意向锁表示 SQL Server 需要在层次结构中的某些底层资源上获取共享 (S) 锁或排它 (X) 锁。例如，放置在表级的共享意向锁表示事务打算在表中的页或行上放置共享 (S) 锁。在表级设置意向锁可防止另一个事务随后在包含那一页的表上获取排它 (X) 锁。意向锁可以提高性能，因为 SQL Server 仅在表级检查意向锁来确定事务是否可以安全地获取该表上的锁。而无须检查表中的每行或每页上的锁以确定事务是否可以锁定整个表。 </li>
</ul>
<h1 id="C"><a href="#C" class="headerlink" title="C++"></a>C++</h1><h2 id="C和C-的区别"><a href="#C和C-的区别" class="headerlink" title="C和C++的区别"></a><strong>C和C++的区别</strong></h2><p>c++在c的基础上增添类，C是一个结构化语言，它的重点在于算法和数据结构。C程序的设计首要考虑的是如何通过一个过程，对输入（或环境条件）进行运算处理得到输出（或实现过程（事务）控制），而对于C++，首要考虑的是如何构造一个对象模型，让这个模型能够契合与之对应的问题域，这样就可以通过获取对象的状态信息得到输出或实现过程（事务）控制</p>
<h2 id="什么是多态"><a href="#什么是多态" class="headerlink" title="什么是多态"></a><strong>什么是多态</strong></h2><p>多态是指相同的操作或函数、过程可作用于多种类型的对象上并获得不同的结果。不同的对象，收到同一消息可以产生不同的结果，这种现象称为多态</p>
<h2 id="const知道吗？解释其作用"><a href="#const知道吗？解释其作用" class="headerlink" title="const知道吗？解释其作用"></a><strong>const知道吗？解释其作用</strong></h2><ul>
<li>const 修饰类的成员变量，表示成员常量，不能被修改</li>
<li>const修饰函数承诺在本函数内部不会修改类内的数据成员，不会调用其它非 const 成员函数</li>
<li>如果 const 构成函数重载，const 对象只能调用 const 函数，非 const 对象优先调用非 const 函数</li>
<li>const 函数只能调用 const 函数。非 const 函数可以调用 const 函数</li>
<li>类体外定义的 const 成员函数，在定义和声明处都需要 const 修饰符</li>
</ul>
<h2 id="类的static变量在什么时候初始化？函数的static变量在什么时候初始化？"><a href="#类的static变量在什么时候初始化？函数的static变量在什么时候初始化？" class="headerlink" title="类的static变量在什么时候初始化？函数的static变量在什么时候初始化？"></a><strong>类的static变量在什么时候初始化？函数的static变量在什么时候初始化？</strong></h2><ul>
<li>类的静态成员变量在类实例化之前就已经存在了，并且分配了内存。函数的static变量在执行此函数时进行初始化</li>
</ul>
<h2 id="解释下封装、继承和多态"><a href="#解释下封装、继承和多态" class="headerlink" title="解释下封装、继承和多态"></a><strong>解释下封装、继承和多态</strong></h2><ul>
<li><p>封装是实现面向对象程序设计的第一步，封装就是将数据或函数等集合在一个个的单元中（我们称之为类）。</p>
<p>封装的意义在于保护或者防止代码（数据）被我们无意中破坏。</p>
</li>
<li><p>继承主要实现重用代码，节省开发时间。</p>
<p>子类可以继承父类的一些东西。</p>
</li>
<li><p>多态：同一操作作用于不同的对象，可以有不同的解释，产生不同的执行结果。在运行时，可以通过指向基类的指针，来调用实现派生类中的方法。</p>
</li>
</ul>
<h2 id="指针和引用的区别"><a href="#指针和引用的区别" class="headerlink" title="指针和引用的区别"></a><strong>指针和引用的区别</strong></h2><ul>
<li>指针是一个变量，只不过这个变量存储的是一个地址，指向内存的一个存储单元；而引用仅是个别名</li>
<li>引用使用时无需解引用(*)，指针需要解引用；</li>
<li>引用只能在定义时被初始化一次，之后不可变；指针可变；</li>
<li>引用没有 const，指针有 const；</li>
<li>引用不能为空，指针可以为空；</li>
<li>“sizeof 引用”得到的是所指向的变量(对象)的大小，而“sizeof 指针”得到的是指针本身的大小；</li>
<li>指针和引用的自增(++)运算意义不一样；</li>
<li>指针可以有多级，但是引用只能是一级（int **p；合法 而 int &amp;&amp;a是不合法的）</li>
<li>从内存分配上看：程序为指针变量分配内存区域，而引用不需要分配内存区域。</li>
</ul>
<h2 id="内存泄漏"><a href="#内存泄漏" class="headerlink" title="内存泄漏"></a>内存泄漏</h2><ul>
<li>定义：内存泄漏（Memory Leak）是指程序中己动态分配的堆内存由于某种原因程序未释放或无法释放，造成系统内存的浪费，导致程序运行速度减慢甚至系统崩溃等严重后果。</li>
<li>malloc的时候得确定在那里free.</li>
</ul>
<h2 id="new和malloc的区别"><a href="#new和malloc的区别" class="headerlink" title="new和malloc的区别"></a><strong>new和malloc的区别</strong></h2><ul>
<li>malloc与free是C++/C语言的标准库函数，new/delete是C++的运算符。它们都可用于申请动态内存和释放内存</li>
<li>new可以认为是malloc加构造函数的执行。new出来的指针是直接带类型信息的。而malloc返回的都是void指针</li>
<li>对于非内部数据类型的对象而言，光用maloc/free无法满足动态对象的要求。对象在创建的同时要自动执行构造函数，对象在消亡之前要自动执行析构函数</li>
</ul>
<h1 id="大数据"><a href="#大数据" class="headerlink" title="大数据"></a>大数据</h1><h2 id="Zookeeper"><a href="#Zookeeper" class="headerlink" title="Zookeeper"></a>Zookeeper</h2><h1 id="杂项"><a href="#杂项" class="headerlink" title="杂项"></a>杂项</h1><h2 id="sleep-和-wait的区别"><a href="#sleep-和-wait的区别" class="headerlink" title="sleep 和 wait的区别"></a>sleep 和 wait的区别</h2><ul>
<li>【是否释放锁】：sleep 没有释放锁，wait释放锁。<br>  因此 wait多用线程交互，sleep只是暂停线程执行</li>
<li>【是否自动苏醒】<br>  线程调用sleep()后，会自动苏醒<br>  线程调用wait() <pre><code>  若wait()无参，需要等待其他线程调 【同一对象】的notify() notifyAll()唤醒。
  若wait()方法有timeout参数,则会超时后苏醒。
</code></pre></li>
</ul>
<h2 id="文件权限"><a href="#文件权限" class="headerlink" title="文件权限"></a>文件权限</h2><figure class="highlight plain"><table><tbody><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br></pre></td><td class="code"><pre><span class="line">文件权限 = {</span><br><span class="line">    1. r 读权限   数字4表示</span><br><span class="line">    2. w 写权限   数字2表示</span><br><span class="line">    3. x 执行权限 数字1表示</span><br><span class="line">}</span><br><span class="line">文件类型={</span><br><span class="line">    d:  目录</span><br><span class="line">    -:  文件</span><br><span class="line">    l:  软链接</span><br><span class="line">}</span><br><span class="line">用户类型 = {</span><br><span class="line">    1. owner 所有者</span><br><span class="line">    2. group 所属组</span><br><span class="line">    3. others 其他组</span><br><span class="line">}</span><br></pre></td></tr></tbody></table></figure>
<h2 id="有状态API和无状态API"><a href="#有状态API和无状态API" class="headerlink" title="有状态API和无状态API"></a>有状态API和无状态API</h2><ul>
<li>有状态API即server端保存了信息，server根据保存的信息进行了交互</li>
<li>无状态API即client端保存了信息, server不需要根据保存的信息进行交互</li>
</ul>
<h2 id="如何提升网站的高可用"><a href="#如何提升网站的高可用" class="headerlink" title="如何提升网站的高可用"></a>如何提升网站的高可用</h2><ul>
<li>采用负载均衡，将一个系统分别放在不同web服务器，通过nginx等服务器反向代理负载均衡</li>
<li>集群，将相同的系统分别放到不同的web服务器或者硬件服务器，这样其中一个挂掉了，网站还可以正常运营</li>
<li>反向代理负载均衡<ul>
<li>Session问题<ol>
<li>session复制</li>
<li>session粘滞</li>
<li>session服务器</li>
</ol>
</li>
</ul>
</li>
</ul>
<h2 id="大型网站如何防治崩溃"><a href="#大型网站如何防治崩溃" class="headerlink" title="大型网站如何防治崩溃"></a>大型网站如何防治崩溃</h2><ul>
<li>提高硬件能力、增加系统服务器。（当服务器增加到某个程度的时候系统所能提供的并发访问量几乎不变，所以不能根本解决问题）</li>
<li>使用缓存</li>
<li>消息队列</li>
<li>采用分布式</li>
<li>CDN 加速</li>
<li>浏览器缓存 页面静态化</li>
<li>使用镜像</li>
<li>图片服务器分离（图片占用资源大）</li>
</ul>
<h2 id="消息队列"><a href="#消息队列" class="headerlink" title="消息队列"></a>消息队列</h2><ul>
<li>生产者往消息队列中放消息，消费者往消息队列中读取消息</li>
<li>好处<ul>
<li>解耦，生产者只需要往消息队列中放消息，不需要管其他模块如何调用消息</li>
<li>异步，异步调用接口，从而实现效率提升</li>
<li>削峰/限流，在高并发的时候只会根据自己能处理的请求数量从消息队列中取信息，从而提高系统高并发</li>
</ul>
</li>
</ul>

    </div>

</div>
