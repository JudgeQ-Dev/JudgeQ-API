
<details class = 'note' >
<summary>目录</summary>

[TOC]

</details>


# 关于这个项目

该项目希望能为以下应用场景提供解决方案：

- `XCPC`比赛的队伍训练
- 团队文档协作

# 档案和文章

本项目对于文章的管理采用「树形结构」：
- 每个`USER`和`TEAM`都是一个「根档案」。
- 进入档案后，可以创建「子档案」和「子文章」，并且「子档案」可以继续创建「子档案」。
- 文章可以选择「公开」或「私有」状态。
- 目前档案默认都是「公开」状态。

# 团队

- 团队的「创建者」享有团队的管理权，譬如：
	- 团队名称的修改。
	- 团队成员的「通过」和「请离」。
- 团队的成员对于团队的「所有档案」和「所有文章」都享有编辑权。


# MarkDown

## 标题

```markdown
# 这是一级标题
## 这是二级标题
### 这是三级标题
#### 这是四级标题
##### 这是五级标题
###### 这是六级标题
```

## 字体

<details class="info" open><summary></summary><div>

<div class="tabbed-set">
<input id="__tabbed_1_1" name="__tabbed_1" type="radio"><label for="__tabbed_1_1">源码</label><div class="tabbed-content">

```markdown
**这是加粗的文字**
*这是倾斜的文字*
***这是斜体加粗的文字***
~~这是加删除线的文字~~
```

</div><input checked id="__tabbed_1_2" name="__tabbed_1" type="radio"><label for="__tabbed_1_2">效果</label><div class="tabbed-content">

**这是加粗的文字**
*这是倾斜的文字*
***这是斜体加粗的文字***
~~这是加删除线的文字~~

</div></div>

</div></details>


## 分割线

<details class="info" open><summary></summary><div>

三个或者三个以上的`-`或者`*`都可以。

<div class="tabbed-set">
<input id="__tabbed_2_1" name="__tabbed_2" type="radio"><label for="__tabbed_2_1">源码</label><div class="tabbed-content">

```markdown
---
----
***
*****
```

</div><input checked id="__tabbed_2_2" name="__tabbed_2" type="radio"><label for="__tabbed_2_2">效果</label><div class="tabbed-content">

---
----
***
*****

</div></div>

</div></details>



## 引用

<details class="info" open><summary></summary><div>

<div class="tabbed-set">
<input id="__tabbed_3_1" name="__tabbed_3" type="radio"><label for="__tabbed_3_1">源码</label><div class="tabbed-content">

```markdown
>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容
```

</div><input checked id="__tabbed_3_2" name="__tabbed_3" type="radio"><label for="__tabbed_3_2">效果</label><div class="tabbed-content">

>这是引用的内容
>>这是引用的内容
>>>>>>>>>>这是引用的内容

</div></div>

</div></details>

## 任务列表

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_4_1" name="__tabbed_4" type="radio"><label for="__tabbed_4_1">源码</label><div class="tabbed-content">

```markdown
- [ ] 还没做
- [x] 做完了
```

</div><input checked id="__tabbed_4_2" name="__tabbed_4" type="radio"><label for="__tabbed_4_2">效果</label><div class="tabbed-content">

- [ ] 还没做
- [x] 做完了

</div></div>

</div></details>

## 超链接

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_5_1" name="__tabbed_5" type="radio"><label for="__tabbed_5_1">源码</label><div class="tabbed-content">

```markdown
[WI-KI](https://wi-ki.top)
```

</div><input checked id="__tabbed_5_2" name="__tabbed_5" type="radio"><label for="__tabbed_5_2">效果</label><div class="tabbed-content">

[WI-KI](https://wi-ki.top)

</div></div>

</div></details>


## ~~注脚~~

别试了，目前不支持注脚。


## 列表

### 无序列表

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_6_1" name="__tabbed_6" type="radio"><label for="__tabbed_6_1">源码</label><div class="tabbed-content">

```markdown
- 列表内容
+ 列表内容
* 列表内容
注意：- + * 跟内容之间都要有一个空格
```

</div><input checked id="__tabbed_6_2" name="__tabbed_6" type="radio"><label for="__tabbed_6_2">效果</label><div class="tabbed-content">

- 列表内容
- 列表内容
- 列表内容

</div></div>

</div></details>



### 有序列表

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_7_1" name="__tabbed_7" type="radio"><label for="__tabbed_7_1">源码</label><div class="tabbed-content">

```markdown
1. 列表内容
2. 列表内容
3. 列表内容
注意：序号跟内容之间要有空格
```

</div><input checked id="__tabbed_7_2" name="__tabbed_7" type="radio"><label for="__tabbed_7_2">效果</label><div class="tabbed-content">

1. 列表内容
2. 列表内容
3. 列表内容

</div></div>

</div></details>

### 列表嵌套

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_8_1" name="__tabbed_8" type="radio"><label for="__tabbed_8_1">源码</label><div class="tabbed-content">

```markdown
- 列表内容
	- 列表内容
		-. 列表内容
			-. 列表内容

1. 列表内容
	1. 列表内容
		1. 列表内容
			1. 列表内容
```

</div><input checked id="__tabbed_8_2" name="__tabbed_8" type="radio"><label for="__tabbed_8_2">效果</label><div class="tabbed-content">

- 列表内容
	- 列表内容
		- 列表内容
			- 列表内容


1. 列表内容
	1. 列表内容
		1. 列表内容
			1. 列表内容

</div></div>

</div></details>


## 表格

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_9_1" name="__tabbed_9" type="radio"><label for="__tabbed_9_1">源码</label><div class="tabbed-content">

```markdown
表头|表头|表头
---|:--:|---:
内容|内容|内容
内容|内容|内容
第二行分割表头和内容。
- 有一个就行，为了对齐，多加了几个
文字默认居左
-两边加：表示文字居中
-右边加：表示文字居右
注：原生的语法两边都要用 | 包起来。此处省略

姓名|技能|排行
--|:--:|--:
刘备|哭|大哥
关羽|打|二哥
张飞|骂|三弟
```

</div><input checked id="__tabbed_9_2" name="__tabbed_9" type="radio"><label for="__tabbed_9_2">效果</label><div class="tabbed-content">

姓名|技能|排行
--|:--:|--:
刘备|哭|大哥
关羽|打|二哥
张飞|骂|三弟

</div></div>

</div></details>


## 代码

### 行内代码

```markdown
`代码内容`
```

### 块级代码

	```lang
	代码内容
	```

## 图片

### 特性

- 编辑器支持图片上传。
- 图片格式限定为`JPG`, `PNG`, `GIF`。
- 图片大小限定为`2MB`。
- 支持粘贴上传、拖拽上传。

### 行内图片

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_10_1" name="__tabbed_10" type="radio"><label for="__tabbed_10_1">源码</label><div class="tabbed-content">

```markdown
![](https://wi-ki.top/attachments/article/4/9e1168e0-c1f9-11ea-80b5-174c378018d1/ZoomOut_ZH-CN4471982075_1920x1080.jpg)
```

</div><input checked id="__tabbed_10_2" name="__tabbed_10" type="radio"><label for="__tabbed_10_2">效果</label><div class="tabbed-content">

![](https://wi-ki.top/attachments/article/4/9e1168e0-c1f9-11ea-80b5-174c378018d1/ZoomOut_ZH-CN4471982075_1920x1080.jpg)


</div></div>

</div></details>

### 块级图片

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_11_1" name="__tabbed_11" type="radio"><label for="__tabbed_11_1">源码</label><div class="tabbed-content">

```markdown
![从太空中拍摄到的地球](https://wi-ki.top/attachments/article/4/9e1168e0-c1f9-11ea-80b5-174c378018d1/ZoomOut_ZH-CN4471982075_1920x1080.jpg "从太空中拍摄到的地球")
```

添加标题即变成`块级图片`，语法如下：

```markdown
![alt提示](图片地址 "图片标题")
```

> tips: 如果不想有标题，但是又想让图片成为`块级图片`，可以在标题中输入几个空格。


</div><input checked id="__tabbed_11_2" name="__tabbed_11" type="radio"><label for="__tabbed_11_2">效果</label><div class="tabbed-content">

![从太空中拍摄到的地球](https://wi-ki.top/attachments/article/4/9e1168e0-c1f9-11ea-80b5-174c378018d1/ZoomOut_ZH-CN4471982075_1920x1080.jpg "从太空中拍摄到的地球")


</div></div>


> 图片来自必应搜索：[https://bing.ioliu.cn/photo/ZoomOut_ZH-CN4471982075?force=ranking_1](https://bing.ioliu.cn/photo/ZoomOut_ZH-CN4471982075?force=ranking_1)

</div></details>

## $\LaTeX$数学公式

$\LaTeX$数学公式采用`MathJax3.0.5`进行渲染。

### 行内公式

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_12_1" name="__tabbed_12" type="radio"><label for="__tabbed_12_1">源码</label><div class="tabbed-content">

```markdown
$e^x$
```

</div><input checked id="__tabbed_12_2" name="__tabbed_12" type="radio"><label for="__tabbed_12_2">效果</label><div class="tabbed-content">

$e^x$

</div></div>

</div></details>


### 块级公式

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_13_1" name="__tabbed_13" type="radio"><label for="__tabbed_13_1">源码</label><div class="tabbed-content">

```markdown
$$
e^x
$$
```

</div><input checked id="__tabbed_13_2" name="__tabbed_13" type="radio"><label for="__tabbed_13_2">效果</label><div class="tabbed-content">

$$
e^x
$$

</div></div>

</div></details>


<details class = 'danger' open>
<summary>但是请不要使用下述语法</summary>

```markdown
$$e^x$$
```

它的效果是这样：

$$e^x$$

至于为什么会这样，是因为渲染流程是先经过 `marked.js` 渲染成 `HTML`，再由 `MathJax` 进行数学公式渲染，那么这个时候 `MarkDown` 中的某些语法会和 $\TeX$ 语法产生冲突，譬如 `\`，`*`。
那么我们用了一些 「奇怪的手段」 把 $\LaTeX$ 公式中的内容放到了一个安全的标签中。
所以上述的渲染效果也正是 「奇怪的手段」的佳作，以后会思考一下更好的隔离方法。

</details>


### 给公式举一个🌰

#### 矩阵

<div class="tabbed-set"><input id="__tabbed_14_1" name="__tabbed_14" type="radio"><label for="__tabbed_14_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{Vmatrix}1&2\\3&4\\ \end{Vmatrix}
$$
```

</div><input checked id="__tabbed_14_2" name="__tabbed_14" type="radio"><label for="__tabbed_14_2">效果</label><div class="tabbed-content">

$$
\begin{Vmatrix}1&2\\3&4\\ \end{Vmatrix}
$$

</div></div>

<div class="tabbed-set"><input id="__tabbed_15_1" name="__tabbed_15" type="radio"><label for="__tabbed_15_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{Bmatrix}1&2\\3&4\\ \end{Bmatrix}
$$
```

</div><input checked id="__tabbed_15_2" name="__tabbed_15" type="radio"><label for="__tabbed_15_2">效果</label><div class="tabbed-content">

$$
\begin{Bmatrix}1&2\\3&4\\ \end{Bmatrix}
$$

</div></div>

<div class="tabbed-set"><input id="__tabbed_16_1" name="__tabbed_16" type="radio"><label for="__tabbed_16_1">源码</label><div class="tabbed-content">

```markdown
$$
\left[
\begin{array}{cc|c}
  1&2&3\\
  4&5&6
\end{array}
\right]
$$
```

</div><input checked id="__tabbed_16_2" name="__tabbed_16" type="radio"><label for="__tabbed_16_2">效果</label><div class="tabbed-content">

$$
\left[
\begin{array}{cc|c}
  1&2&3\\
  4&5&6
\end{array}
\right]
$$

</div></div>




#### 对齐方程

<div class="tabbed-set"><input id="__tabbed_17_1" name="__tabbed_17" type="radio"><label for="__tabbed_17_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{align}
\sqrt{37} & = \sqrt{\frac{73^2-1}{12^2}} \\
 & = \sqrt{\frac{73^2}{12^2}\cdot\frac{73^2-1}{73^2}} \\ 
 & = \sqrt{\frac{73^2}{12^2}}\sqrt{\frac{73^2-1}{73^2}} \\
 & = \frac{73}{12}\sqrt{1 - \frac{1}{73^2}} \\ 
 & \approx \frac{73}{12}\left(1 - \frac{1}{2\cdot73^2}\right)
\end{align}
$$
```

</div><input checked id="__tabbed_17_2" name="__tabbed_17" type="radio"><label for="__tabbed_17_2">效果</label><div class="tabbed-content">

$$
\begin{align}
\sqrt{37} & = \sqrt{\frac{73^2-1}{12^2}} \\
 & = \sqrt{\frac{73^2}{12^2}\cdot\frac{73^2-1}{73^2}} \\ 
 & = \sqrt{\frac{73^2}{12^2}}\sqrt{\frac{73^2-1}{73^2}} \\
 & = \frac{73}{12}\sqrt{1 - \frac{1}{73^2}} \\ 
 & \approx \frac{73}{12}\left(1 - \frac{1}{2\cdot73^2}\right)
\end{align}
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_18_1" name="__tabbed_18" type="radio"><label for="__tabbed_18_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{align}
f(x)&=\left(x^3\right)+\left(x^3+x^2+x^1\right)+\left(x^3+x^‌​2\right)\\
f'(x)&=\left(3x^2+2x+1\right)+\left(3x^2+2x\right)\\
f''(x)&=\left(6x+2\right)\\ \end{align}
$$
```

</div><input checked id="__tabbed_18_2" name="__tabbed_18" type="radio"><label for="__tabbed_18_2">效果</label><div class="tabbed-content">

$$
\begin{align}
f(x)&=\left(x^3\right)+\left(x^3+x^2+x^1\right)+\left(x^3+x^2\right)\\
f'(x)&=\left(3x^2+2x+1\right)+\left(3x^2+2x\right)\\
f''(x)&=\left(6x+2\right)\\ \end{align}
$$

</div></div>



#### 分段函数

<div class="tabbed-set"><input id="__tabbed_19_1" name="__tabbed_19" type="radio"><label for="__tabbed_19_1">源码</label><div class="tabbed-content">

```markdown
$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}
\end{cases}
$$
```

</div><input checked id="__tabbed_19_2" name="__tabbed_19" type="radio"><label for="__tabbed_19_2">效果</label><div class="tabbed-content">

$$
f(n) =
\begin{cases}
n/2,  & \text{if $n$ is even} \\
3n+1, & \text{if $n$ is odd}
\end{cases}
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_20_1" name="__tabbed_20" type="radio"><label for="__tabbed_20_1">源码</label><div class="tabbed-content">

```markdown
$$
\left.
\begin{array}{l}
\text{if $n$ is even:}&n/2\\
\text{if $n$ is odd:}&3n+1
\end{array}
\right\}
=f(n)
$$
```

</div><input checked id="__tabbed_20_2" name="__tabbed_20" type="radio"><label for="__tabbed_20_2">效果</label><div class="tabbed-content">

$$
\left.
\begin{array}{l}
\text{if $n$ is even:}&n/2\\
\text{if $n$ is odd:}&3n+1
\end{array}
\right\}
=f(n)
$$

</div></div>





#### 数组

<div class="tabbed-set"><input id="__tabbed_21_1" name="__tabbed_21" type="radio"><label for="__tabbed_21_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i
\end{array}
$$
```

</div><input checked id="__tabbed_21_2" name="__tabbed_21" type="radio"><label for="__tabbed_21_2">效果</label><div class="tabbed-content">

$$
\begin{array}{c|lcr}
n & \text{Left} & \text{Center} & \text{Right} \\
\hline
1 & 0.24 & 1 & 125 \\
2 & -1 & 189 & -8 \\
3 & -20 & 2000 & 1+10i
\end{array}
$$

</div></div>

<div class="tabbed-set"><input id="__tabbed_22_1" name="__tabbed_22" type="radio"><label for="__tabbed_22_1">源码</label><div class="tabbed-content">

```markdown
$$
% outer vertical array of arrays
\begin{array}{c}
% inner horizontal array of arrays
\begin{array}{cc}
% inner array of minimum values
\begin{array}{c|cccc}
\text{min} & 0 & 1 & 2 & 3\\
\hline
0 & 0 & 0 & 0 & 0\\
1 & 0 & 1 & 1 & 1\\
2 & 0 & 1 & 2 & 2\\
3 & 0 & 1 & 2 & 3
\end{array}
&
% inner array of maximum values
\begin{array}{c|cccc}
\text{max}&0&1&2&3\\
\hline
0 & 0 & 1 & 2 & 3\\
1 & 1 & 1 & 2 & 3\\
2 & 2 & 2 & 2 & 3\\
3 & 3 & 3 & 3 & 3
\end{array}
\end{array}
\\
% inner array of delta values
\begin{array}{c|cccc}
\Delta&0&1&2&3\\
\hline
0 & 0 & 1 & 2 & 3\\
1 & 1 & 0 & 1 & 2\\
2 & 2 & 1 & 0 & 1\\
3 & 3 & 2 & 1 & 0
\end{array}
\end{array}
$$
```

</div><input checked id="__tabbed_22_2" name="__tabbed_22" type="radio"><label for="__tabbed_22_2">效果</label><div class="tabbed-content">

$$
% outer vertical array of arrays
\begin{array}{c}
% inner horizontal array of arrays
\begin{array}{cc}
% inner array of minimum values
\begin{array}{c|cccc}
\text{min} & 0 & 1 & 2 & 3\\
\hline
0 & 0 & 0 & 0 & 0\\
1 & 0 & 1 & 1 & 1\\
2 & 0 & 1 & 2 & 2\\
3 & 0 & 1 & 2 & 3
\end{array}
&
% inner array of maximum values
\begin{array}{c|cccc}
\text{max}&0&1&2&3\\
\hline
0 & 0 & 1 & 2 & 3\\
1 & 1 & 1 & 2 & 3\\
2 & 2 & 2 & 2 & 3\\
3 & 3 & 3 & 3 & 3
\end{array}
\end{array}
\\
% inner array of delta values
\begin{array}{c|cccc}
\Delta&0&1&2&3\\
\hline
0 & 0 & 1 & 2 & 3\\
1 & 1 & 0 & 1 & 2\\
2 & 2 & 1 & 0 & 1\\
3 & 3 & 2 & 1 & 0
\end{array}
\end{array}
$$

</div></div>



#### 方程组

<div class="tabbed-set"><input id="__tabbed_23_1" name="__tabbed_23" type="radio"><label for="__tabbed_23_1">源码</label><div class="tabbed-content">

```markdown
$$
\left\{ 
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$
```

</div><input checked id="__tabbed_23_2" name="__tabbed_23" type="radio"><label for="__tabbed_23_2">效果</label><div class="tabbed-content">

$$
\left\{ 
\begin{array}{c}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{array}
\right.
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_24_1" name="__tabbed_24" type="radio"><label for="__tabbed_24_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{cases}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{cases}
$$
```

</div><input checked id="__tabbed_24_2" name="__tabbed_24" type="radio"><label for="__tabbed_24_2">效果</label><div class="tabbed-content">

$$
\begin{cases}
a_1x+b_1y+c_1z=d_1 \\ 
a_2x+b_2y+c_2z=d_2 \\ 
a_3x+b_3y+c_3z=d_3
\end{cases}
$$


</div></div>

<div class="tabbed-set"><input id="__tabbed_25_1" name="__tabbed_25" type="radio"><label for="__tabbed_25_1">源码</label><div class="tabbed-content">

```markdown
$$
\left\{
\begin{aligned} 
a_1x+b_1y+c_1z &=d_1+e_1 \\ 
a_2x+b_2y&=d_2 \\ 
a_3x+b_3y+c_3z &=d_3 
\end{aligned} 
\right. 
$$
```

</div><input checked id="__tabbed_25_2" name="__tabbed_25" type="radio"><label for="__tabbed_25_2">效果</label><div class="tabbed-content">

$$
\left\{
\begin{aligned} 
a_1x+b_1y+c_1z &=d_1+e_1 \\ 
a_2x+b_2y&=d_2 \\ 
a_3x+b_3y+c_3z &=d_3 
\end{aligned} 
\right. 
$$

</div></div>


#### 颜色


<div class="tabbed-set"><input id="__tabbed_26_1" name="__tabbed_26" type="radio"><label for="__tabbed_26_1">源码</label><div class="tabbed-content">

```markdown
$$
\begin{array}{|rc|}
\hline
\verb+\color{black}{text}+ & \color{black}{text} \\
\verb+\color{gray}{text}+ & \color{gray}{text} \\
\verb+\color{silver}{text}+ & \color{silver}{text} \\
\verb+\color{white}{text}+ & \color{white}{text} \\
\hline
\verb+\color{maroon}{text}+ & \color{maroon}{text} \\
\verb+\color{red}{text}+ & \color{red}{text} \\
\verb+\color{yellow}{text}+ & \color{yellow}{text} \\
\verb+\color{lime}{text}+ & \color{lime}{text} \\
\verb+\color{olive}{text}+ & \color{olive}{text} \\
\verb+\color{green}{text}+ & \color{green}{text} \\
\verb+\color{teal}{text}+ & \color{teal}{text} \\
\verb+\color{aqua}{text}+ & \color{aqua}{text} \\
\verb+\color{blue}{text}+ & \color{blue}{text} \\
\verb+\color{navy}{text}+ & \color{navy}{text} \\
\verb+\color{purple}{text}+ & \color{purple}{text} \\ 
\verb+\color{fuchsia}{text}+ & \color{magenta}{text} \\
\hline
\end{array}
$$
```

</div><input checked id="__tabbed_26_2" name="__tabbed_26" type="radio"><label for="__tabbed_26_2">效果</label><div class="tabbed-content">

$$
\begin{array}{|rc|}
\hline
\verb+\color{black}{text}+ & \color{black}{text} \\
\verb+\color{gray}{text}+ & \color{gray}{text} \\
\verb+\color{silver}{text}+ & \color{silver}{text} \\
\verb+\color{white}{text}+ & \color{white}{text} \\
\hline
\verb+\color{maroon}{text}+ & \color{maroon}{text} \\
\verb+\color{red}{text}+ & \color{red}{text} \\
\verb+\color{yellow}{text}+ & \color{yellow}{text} \\
\verb+\color{lime}{text}+ & \color{lime}{text} \\
\verb+\color{olive}{text}+ & \color{olive}{text} \\
\verb+\color{green}{text}+ & \color{green}{text} \\
\verb+\color{teal}{text}+ & \color{teal}{text} \\
\verb+\color{aqua}{text}+ & \color{aqua}{text} \\
\verb+\color{blue}{text}+ & \color{blue}{text} \\
\verb+\color{navy}{text}+ & \color{navy}{text} \\
\verb+\color{purple}{text}+ & \color{purple}{text} \\ 
\verb+\color{fuchsia}{text}+ & \color{magenta}{text} \\
\hline
\end{array}
$$

</div></div>

#### 字体

<div class="tabbed-set"><input id="__tabbed_27_1" name="__tabbed_27" type="radio"><label for="__tabbed_27_1">源码</label><div class="tabbed-content">

```markdown
$$
\mathbf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}
$$
```

</div><input checked id="__tabbed_27_2" name="__tabbed_27" type="radio"><label for="__tabbed_27_2">效果</label><div class="tabbed-content">

$$
\mathbf{ABCDEFGHIJKLMNOPQRSTUVWXYZ}
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_28_1" name="__tabbed_28" type="radio"><label for="__tabbed_28_1">源码</label><div class="tabbed-content">

```markdown
$$
\pmb{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$
```

</div><input checked id="__tabbed_28_2" name="__tabbed_28" type="radio"><label for="__tabbed_28_2">效果</label><div class="tabbed-content">

$$
\pmb{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_29_1" name="__tabbed_29" type="radio"><label for="__tabbed_29_1">源码</label><div class="tabbed-content">

```markdown
$$
\mathcal{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$
```

</div><input checked id="__tabbed_29_2" name="__tabbed_29" type="radio"><label for="__tabbed_29_2">效果</label><div class="tabbed-content">

$$
\mathcal{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$

</div></div>


<div class="tabbed-set"><input id="__tabbed_30_1" name="__tabbed_30" type="radio"><label for="__tabbed_30_1">源码</label><div class="tabbed-content">

```markdown
$$
\mathscr{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$
```

</div><input checked id="__tabbed_30_2" name="__tabbed_30" type="radio"><label for="__tabbed_30_2">效果</label><div class="tabbed-content">

$$
\mathscr{ABCDEFGHIJKLMNOPQRSTUVWXYZ,abcdefghijklmnopqrstuvwxyz}
$$

</div></div>


> 参考链接：
> - [https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference](https://math.meta.stackexchange.com/questions/5020/mathjax-basic-tutorial-and-quick-reference)
> - [https://www.yuque.com/yuque/help/brzicb](https://www.yuque.com/yuque/help/brzicb)




## DETAILS

<details class="info" open><summary></summary><div>

<div class="tabbed-set"><input id="__tabbed_31_1" name="__tabbed_31" type="radio"><label for="__tabbed_31_1">源码</label><div class="tabbed-content">

```markdown
<details class = 'info|danger|success|note' [open]>
<summary>title</summary>

</details>
```

> 注意：在`HTML`源码和`MarkDowm`语法之间需要加入空行间隔

</div><input checked id="__tabbed_31_2" name="__tabbed_31" type="radio"><label for="__tabbed_31_2">效果</label><div class="tabbed-content">

<details class = 'info' open>
<summary>info open</summary>

$$
\left( \sum\limits_{k=1}^n a_k b_k \right)^2
\leq
\left( \sum\limits_{k=1}^n a_k^2 \right)
\left( \sum\limits_{k=1}^n b_k^2 \right)
$$

$$
\displaystyle 
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

</details>

<details class = 'danger'>
<summary>danger</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;
```

</details>

<details class = 'success'>
<summary>success</summary>

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



<details class = 'note'>
<summary>note</summary>

```cpp
#include <bits/stdc++.h>
using namespace std;

int main() {
	return 0;
}
```

</details>

</div></div>

</div></details>




## TABBED

加载中...

## HTML

编辑器支持部分`HTML`标签，但是`HTML`标签与`MarkDown`语法之间需要插入若干空行才能正常解析。
对于部分不安全的标签，包含但不限于`Script`, `Style`等编辑器会进行过滤，但是标签内的`style`是合法的。


# 协同协作

抱歉，该项目目前不支持多人协同写作，但是我们提供了历史记录查看功能和对比功能，希望能够缓解多人对同一文档享有编辑权时造成的更新覆盖问题。


