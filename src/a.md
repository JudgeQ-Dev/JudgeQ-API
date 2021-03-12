[toc]

::: spoiler click me
$$
\begin{align}
3^1 &= 3 \\
3^2 &= \left(3^1\right)^2 = 3^2 = 9 \\
3^4 &= \left(3^2\right)^2 = 9^2 = 81 \\
3^8 &= \left(3^4\right)^2 = 81^2 = 6561
\end{align}
$$
:::

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

