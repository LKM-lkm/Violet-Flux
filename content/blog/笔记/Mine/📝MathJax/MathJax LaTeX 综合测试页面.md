---
title: MathJax LaTeX 综合测试页面
description: 使用标准 LaTeX 语法的 MathJax 测试页面，无需转义花括号，保持源文件可读性
---

# MathJax LaTeX 综合测试页面

欢迎来到 MathJax 渲染测试页面！

此页面使用标准 LaTeX 语法（`\(...\)` 和 `\[...\]`），无需转义花括号，保持源文件的可读性和可维护性。

## 1. 基础定界符测试

### 行内公式 (Inline)

行内公式应该无缝地嵌入到文本中。例如，爱因斯坦的质能方程 \(E = mc^2\) 是一个著名的例子。

### 块级公式 (Display)

块级公式应该独立成行并且居中显示。

使用 `\[...\]` 定界符的高斯积分公式：

\[
\int_{-\infty}^{\infty} e^{-x^2} dx = \sqrt{\pi}
\]

使用 `$$...$$` 定界符的欧拉恒等式：

$$
e^{i\pi} + 1 = 0
$$

## 2. 常用数学元素

### 上下标

- **单个字符**：\(x^2\), \(a_i\)
- **多个字符** (需用 `{}` 包裹): \(e^{i\theta}\), \(A_{ij}\)
- **组合使用**: \(R_{ij}^{ab}\)
- **经典公式**: 勾股定理 \(a^2 + b^2 = c^2\)

### 分数与根式

- **简单分数**: \(\frac{1}{2}\)
- **复杂分数**: \(\frac{d}{dx} \left( \frac{x}{x+1} \right)\)
- **平方根**: \(\sqrt{42}\)
- **平方根+分数**: \(\sqrt{\frac{a}{b}}\)
- **N次根**: \(\sqrt[3]{27}\)
- **一元二次方程求根公式**:

\[
x = \frac{-b \pm \sqrt{b^2 - 4ac}}{2a}
\]

### 希腊字母与运算符

- **常用希腊字母**: \(\alpha, \beta, \gamma, \delta, \epsilon, \zeta, \eta, \theta, \iota, \kappa, \lambda, \mu, \xi, \pi, \rho, \sigma, \tau, \phi, \psi, \omega\)
- **大写希腊字母**: \(\Gamma, \Delta, \Theta, \Lambda, \Xi, \Pi, \Sigma, \Phi, \Psi, \Omega\)
- **求和 (Summation)**:

\[
\sum_{k=1}^{n} k^2 = \frac{n(n+1)(2n+1)}{6}
\]

- **积分 (Integral)**:

\[
\int_a^b f(x) dx
\]

- **极限 (Limit)**:

\[
\lim_{x \to 0} \frac{\sin x}{x} = 1
\]

## 3. 高级排版结构

### 矩阵与行列式

使用 `pmatrix` (圆括号):

\[
\begin{pmatrix}
1 & 2 & 3 \\
4 & 5 & 6 \\
7 & 8 & 9
\end{pmatrix}
\]

使用 `bmatrix` (方括号):

\[
\mathbf{X} = \begin{bmatrix}
x_{11} & x_{12} \\
x_{21} & x_{22}
\end{bmatrix}
\]

使用 `vmatrix` (行列式):

\[
\det(\mathbf{A}) = \begin{vmatrix}
a & b \\
c & d
\end{vmatrix} = ad - bc
\]

### 多行对齐公式

使用 `aligned` 环境，`&` 符号用于指定对齐点，`\\` 用于换行。

\[
\begin{aligned}
f(x) &= (x+1)^2 \\
     &= x^2 + 2x + 1
\end{aligned}
\]

### 分段函数

使用 `cases` 环境定义分段函数。

\[
f(n) = \begin{cases}
n/2,      & \text{if } n \text{ is even} \\
3n+1,     & \text{if } n \text{ is odd}
\end{cases}
\]

## 4. 复杂公式示例

### 傅里叶变换

\[
\mathcal{F}(f)(\\omega) = \int_{-\infty}^{\infty} f(t) e^{-i\omega t} dt
\]

### 麦克斯韦方程组

\[
\begin{aligned}
\nabla \cdot \mathbf{E} &= \frac{\rho}{\epsilon_0} \\
\nabla \cdot \mathbf{B} &= 0 \\
\nabla \times \mathbf{E} &= -\frac{\partial \mathbf{B}}{\partial t} \\
\nabla \times \mathbf{B} &= \mu_0 \mathbf{J} + \mu_0 \epsilon_0 \frac{\partial \mathbf{E}}{\partial t}
\end{aligned}
\]

### 薛定谔方程

\[
i\hbar \frac{\partial}{\partial t} \Psi(\mathbf{r}, t) = \left[ -\frac{\hbar^2}{2m} \nabla^2 + V(\mathbf{r}, t) \right] \Psi(\mathbf{r}, t)
\]

## 5. 字体与样式测试

- **普通文本 `\text`**:

\[
\text{能量} = \text{质量} \times (\text{光速})^2
\]

- **粗体 (Bold)**: \(\mathbf{v} + \mathbf{w}\)
- **花体 (Calligraphic)**: \(\mathcal{L}\)
- **黑板粗体 (Blackboard Bold)**: \(\mathbb{R}\) 代表实数集，\(\mathbb{C}\) 代表复数集

## 6. 特殊符号

- **无穷大**: \(\infty\)
- **偏导数**: \(\partial f / \partial x\)
- **梯度**: \(\nabla f\)
- **点乘**: \(\mathbf{a} \cdot \mathbf{b}\)
- **叉乘**: \(\mathbf{a} \times \mathbf{b}\)
- **约等于**: \(\approx\)
- **不等于**: \(\neq\)
- **小于等于**: \(\leq\)
- **大于等于**: \(\geq\)
- **属于**: \(\in\)
- **子集**: \(\subset\)
- **并集**: \(\cup\)
- **交集**: \(\cap\)

## 7. 行内与块级混合

在文本中，我们可以使用行内公式 \(\int_0^1 x^2 dx = \frac{1}{3}\) 来表达简单的数学关系。对于更复杂的推导，我们使用块级公式：

\[
\begin{aligned}
\int_0^1 x^2 dx &= \left[ \frac{x^3}{3} \right]_0^1 \\
&= \frac{1^3}{3} - \frac{0^3}{3} \\
&= \frac{1}{3}
\end{aligned}
\]

这样的混合使用让文档既简洁又清晰。

## 总结

如果以上所有公式都显示正常、对齐无误、字体优