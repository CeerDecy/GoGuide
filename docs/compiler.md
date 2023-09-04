# Go语言编译器

## 1. 函数内联

> 函数内联指的是将**较小**的函数**组合**进调用者的函数内部（代码拼接）。函数内联的优势可以减少通过函数调用带来的额外开销，以此来提升性能。

函数内联是由Golang编译器自动优化的。在函数上方加上`//go:noinline`注释可以禁止进行函数内联优化，于是我们就可以来比较一下优化前和优化后的性能。

这里有两个max函数，其中`max1`函数禁止了”内联优化“。我们通过Benchmark性能测试可以比较一下两者的性能。

```go
// main.go

//go:noinline
func max1(a, b int) int {
	if a > b {
		return a
	}
	return b
}

func max2(a, b int) int {
	if a > b {
		return a
	}
	return b
}


// main_benchmark_test.go
func BenchmarkMax1(b *testing.B) {
	var res int
	for i := 0; i < b.N; i++ {
		res = max1(-1, i)
	}
	_ = res
}

func BenchmarkMax2(b *testing.B) {
	var res int
	for i := 0; i < b.N; i++ {
		res = max2(-1, i)
	}
	_ = res
}
```

通过比较两者的结果可得出在进行函数内联后，max函数**内联后**执行的效率明显高于**非内联**的情况。

```bash
BenchmarkMax1
BenchmarkMax1-8   	529375077	         2.049 ns/op
BenchmarkMax2
BenchmarkMax2-8   	1000000000	         0.3149 ns/op
```

* **内联条件 ：** Go编译器根据函数的复杂程度来决定当前函数是否需要进行内联。

1. 当函数的内部存在for、range、go、select等语句时，该函数就不会被内联。
2. 当函数内部语句太多或者出现递归调用时，该函数不会被内联。
3. 当函数前有`//go:noinline`注释时，该函数不会被内联。

如果用户希望程序中的所有函数都不要进行内联，则可以在编译时加上参数`-l`。

```bash
go build -gcflags="-l" main.go
go tool compile -l main.go
```

我们也可以在调试阶段查看那些函数进行了”内联优化“。可以看到`max1`函数不可被内联，原因是被我们标记了`go:noinline`，而`max2`函数就可以被内联。

```bash
go tool compile -m=2 main.go           
/GoProject/Main/main/main.go:4:6: cannot inline max1: marked go:noinline
/GoProject/Main/main/main.go:11:6: can inline max2 with cost 8 as: func(int, int) int { if a > b { return a }; return b }
/GoProject/Main/main/main.go:18:6: can inline main with cost 0 as: func() {  }
```