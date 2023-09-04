import{_ as n,o as s,c as a,e}from"./app.f5620ece.js";const t={},o=e(`<h1 id="go语言编译器" tabindex="-1"><a class="header-anchor" href="#go语言编译器" aria-hidden="true">#</a> Go语言编译器</h1><h2 id="_1-函数内联" tabindex="-1"><a class="header-anchor" href="#_1-函数内联" aria-hidden="true">#</a> 1. 函数内联</h2><blockquote><p>函数内联指的是将<strong>较小</strong>的函数<strong>组合</strong>进调用者的函数内部（代码拼接）。函数内联的优势可以减少通过函数调用带来的额外开销，以此来提升性能。</p></blockquote><p>函数内联是由Golang编译器自动优化的。在函数上方加上<code>//go:noinline</code>注释可以禁止进行函数内联优化，于是我们就可以来比较一下优化前和优化后的性能。</p><p>这里有两个max函数，其中<code>max1</code>函数禁止了”内联优化“。我们通过Benchmark性能测试可以比较一下两者的性能。</p><div class="language-go line-numbers-mode" data-ext="go"><pre class="language-go"><code><span class="token comment">// main.go</span>

<span class="token comment">//go:noinline</span>
<span class="token keyword">func</span> <span class="token function">max1</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> a <span class="token operator">&gt;</span> b <span class="token punctuation">{</span>
		<span class="token keyword">return</span> a
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> b
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">max2</span><span class="token punctuation">(</span>a<span class="token punctuation">,</span> b <span class="token builtin">int</span><span class="token punctuation">)</span> <span class="token builtin">int</span> <span class="token punctuation">{</span>
	<span class="token keyword">if</span> a <span class="token operator">&gt;</span> b <span class="token punctuation">{</span>
		<span class="token keyword">return</span> a
	<span class="token punctuation">}</span>
	<span class="token keyword">return</span> b
<span class="token punctuation">}</span>


<span class="token comment">// main_benchmark_test.go</span>
<span class="token keyword">func</span> <span class="token function">BenchmarkMax1</span><span class="token punctuation">(</span>b <span class="token operator">*</span>testing<span class="token punctuation">.</span>B<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> res <span class="token builtin">int</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> b<span class="token punctuation">.</span>N<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		res <span class="token operator">=</span> <span class="token function">max1</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token boolean">_</span> <span class="token operator">=</span> res
<span class="token punctuation">}</span>

<span class="token keyword">func</span> <span class="token function">BenchmarkMax2</span><span class="token punctuation">(</span>b <span class="token operator">*</span>testing<span class="token punctuation">.</span>B<span class="token punctuation">)</span> <span class="token punctuation">{</span>
	<span class="token keyword">var</span> res <span class="token builtin">int</span>
	<span class="token keyword">for</span> i <span class="token operator">:=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> b<span class="token punctuation">.</span>N<span class="token punctuation">;</span> i<span class="token operator">++</span> <span class="token punctuation">{</span>
		res <span class="token operator">=</span> <span class="token function">max2</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">,</span> i<span class="token punctuation">)</span>
	<span class="token punctuation">}</span>
	<span class="token boolean">_</span> <span class="token operator">=</span> res
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>通过比较两者的结果可得出在进行函数内联后，max函数<strong>内联后</strong>执行的效率明显高于<strong>非内联</strong>的情况。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>BenchmarkMax1
BenchmarkMax1-8   	<span class="token number">529375077</span>	         <span class="token number">2.049</span> ns/op
BenchmarkMax2
BenchmarkMax2-8   	<span class="token number">1000000000</span>	         <span class="token number">0.3149</span> ns/op
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li><strong>内联条件 ：</strong> Go编译器根据函数的复杂程度来决定当前函数是否需要进行内联。</li></ul><ol><li>当函数的内部存在for、range、go、select等语句时，该函数就不会被内联。</li><li>当函数内部语句太多或者出现递归调用时，该函数不会被内联。</li><li>当函数前有<code>//go:noinline</code>注释时，该函数不会被内联。</li></ol><p>如果用户希望程序中的所有函数都不要进行内联，则可以在编译时加上参数<code>-l</code>。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>go build <span class="token parameter variable">-gcflags</span><span class="token operator">=</span><span class="token string">&quot;-l&quot;</span> main.go
go tool compile <span class="token parameter variable">-l</span> main.go
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>我们也可以在调试阶段查看那些函数进行了”内联优化“。可以看到<code>max1</code>函数不可被内联，原因是被我们标记了<code>go:noinline</code>，而<code>max2</code>函数就可以被内联。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>go tool compile <span class="token parameter variable">-m</span><span class="token operator">=</span><span class="token number">2</span> main.go           
/GoProject/Main/main/main.go:4:6: cannot inline max1: marked go:noinline
/GoProject/Main/main/main.go:11:6: can inline max2 with cost <span class="token number">8</span> as: func<span class="token punctuation">(</span>int, int<span class="token punctuation">)</span> int <span class="token punctuation">{</span> <span class="token keyword">if</span> a <span class="token operator">&gt;</span> b <span class="token punctuation">{</span> <span class="token builtin class-name">return</span> a <span class="token punctuation">}</span><span class="token punctuation">;</span> <span class="token builtin class-name">return</span> b <span class="token punctuation">}</span>
/GoProject/Main/main/main.go:18:6: can inline main with cost <span class="token number">0</span> as: <span class="token function-name function">func</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  <span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,14),p=[o];function i(c,l){return s(),a("div",null,p)}const r=n(t,[["render",i],["__file","compiler.html.vue"]]);export{r as default};
