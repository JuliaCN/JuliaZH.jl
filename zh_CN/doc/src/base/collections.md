# 集合和数据结构

## [迭代](@id lib-collections-iteration)

序列迭代由 [`iterate`](@ref) 实现
广义的 `for` 循环

```julia
for i in iter   # or  "for i = iter"
    # body
end
```

被转换成

```julia
next = iterate(iter)
while next !== nothing
    (i, state) = next
    # body
    next = iterate(iter, state)
end
```

`state` 对象可以是任何对象，并且对于每个可迭代类型应该选择合适的 `state` 对象。
请参照 [帮助文档接口的迭代小节](@ref man-interface-iteration) 来获取关于定义一个常见迭代类型的更多细节。

```@docs
Base.iterate
Base.IteratorSize
Base.IteratorEltype
```

以下类型均完全实现了上述函数：

  * [`AbstractRange`](@ref)
  * [`UnitRange`](@ref)
  * `Tuple`
  * `Number`
  * [`AbstractArray`](@ref)
  * [`BitSet`](@ref)
  * [`IdDict`](@ref)
  * [`Dict`](@ref)
  * [`WeakKeyDict`](@ref)
  * `EachLine`
  * `AbstractString`
  * [`Set`](@ref)
  * [`Pair`](@ref)
  * [`NamedTuple`](@ref)

## 构造函数和类型

```@docs
Base.AbstractRange
Base.OrdinalRange
Base.AbstractUnitRange
Base.StepRange
Base.UnitRange
Base.LinRange
```

## 通用集合

```@docs
Base.isempty
Base.empty!
Base.length
```

以下类型均完全实现了上述函数：

  * [`AbstractRange`](@ref)
  * [`UnitRange`](@ref)
  * `Tuple`
  * `Number`
  * [`AbstractArray`](@ref)
  * [`BitSet`](@ref)
  * [`IdDict`](@ref)
  * [`Dict`](@ref)
  * [`WeakKeyDict`](@ref)
  * `AbstractString`
  * [`Set`](@ref)
  * [`NamedTuple`](@ref)

## 可迭代集合

```@docs
Base.in
Base.:∉
Base.eltype
Base.indexin
Base.unique
Base.unique!
Base.allunique
Base.reduce(::Any, ::Any)
Base.foldl(::Any, ::Any)
Base.foldr(::Any, ::Any)
Base.maximum
Base.maximum!
Base.minimum
Base.minimum!
Base.extrema
Base.argmax
Base.argmin
Base.findmax
Base.findmin
Base.findmax!
Base.findmin!
Base.sum
Base.sum!
Base.prod
Base.prod!
Base.any(::Any)
Base.any(::AbstractArray, ::Any)
Base.any!
Base.all(::Any)
Base.all(::AbstractArray, ::Any)
Base.all!
Base.count
Base.any(::Any, ::Any)
Base.all(::Any, ::Any)
Base.foreach
Base.map
Base.map!
Base.mapreduce(::Any, ::Any, ::Any)
Base.mapfoldl(::Any, ::Any, ::Any)
Base.mapfoldr(::Any, ::Any, ::Any)
Base.first
Base.last
Base.front
Base.tail
Base.step
Base.collect(::Any)
Base.collect(::Type, ::Any)
Base.filter
Base.filter!
Base.replace(::Any, ::Pair...)
Base.replace(::Base.Callable, ::Any)
Base.replace!
```

## 可索引集合

```@docs
Base.getindex
Base.setindex!
Base.firstindex
Base.lastindex
```

以下类型均完全实现了上述函数：

  * [`Array`](@ref)
  * [`BitArray`](@ref)
  * [`AbstractArray`](@ref)
  * `SubArray`

以下类型仅实现了部分上述函数：

  * [`AbstractRange`](@ref)
  * [`UnitRange`](@ref)
  * `Tuple`
  * `AbstractString`
  * [`Dict`](@ref)
  * [`IdDict`](@ref)
  * [`WeakKeyDict`](@ref)
  * [`NamedTuple`](@ref)

## 字典

[`Dict`](@ref) 是一个标准字典。其实现利用了 [`hash`](@ref) 作为键的哈希函数和 [`isequal`](@ref) 来决定是否相等。对于自定义类型，可以定义这两个函数来重载它们在哈希表内的存储方式。

[`IdDict`](@ref) 是一种特殊的哈希表，在里面键始终是对象标识符。

[`WeakKeyDict`](@ref) 是一个哈希表的实现，里面键是对象的弱引用，
所以即使键在哈希表中被引用也有可能被垃圾回收。
它像 `Dict` 一样使用 `hash` 来做哈希和 `isequal` 来做相等判断，
但是它不会在插入时转换键，这点不像 `Dict`。

[`Dict`](@ref)s 可以由传递含有 `=>` 的成对对象给 [`Dict`](@ref) 的构造函数来被创建：`Dict("A"=>1, "B"=>2)`。
这个调用会尝试从键值对中推到类型信息（比如这个例子创造了一个 `Dict{String, Int64}`）。
为了显式指定类型，请使用语法 `Dict{KeyType,ValueType}(...)`。例如：`Dict{String,Int32}("A"=>1, "B"=>2)`。

字典也可以用生成器创建。例如：`Dict(i => f(i) for i = 1:10)`。

对于字典 `D`，若键 `x` 的值存在，则语法 `D[x]` 返回 `x` 的值；否则抛出一个错误。
`D[x] = y` 存储键值对 `x => y` 到 `D` 中，会覆盖键 `x` 的已有的值。
多个参数传入`D[...]` 会被转化成元组；
例如：语法 `D[x,y]` 等于 `D[(x,y)]`，也就是说，它指向键为元组 `(x,y)` 的值。

```@docs
Base.AbstractDict
Base.Dict
Base.IdDict
Base.WeakKeyDict
Base.ImmutableDict
Base.haskey
Base.get(::Any, ::Any, ::Any)
Base.get
Base.get!(::Any, ::Any, ::Any)
Base.get!(::Function, ::Any, ::Any)
Base.getkey
Base.delete!
Base.pop!(::Any, ::Any, ::Any)
Base.keys
Base.values
Base.pairs
Base.merge
Base.mergewith
Base.merge!
Base.mergewith!
Base.sizehint!
Base.keytype
Base.valtype
```

以下类型均完全实现了上述函数：

  * [`IdDict`](@ref)
  * [`Dict`](@ref)
  * [`WeakKeyDict`](@ref)

以下类型仅实现了部分上述函数：

  * [`BitSet`](@ref)
  * [`Set`](@ref)
  * [`EnvDict`](@ref Base.EnvDict)
  * [`Array`](@ref)
  * [`BitArray`](@ref)
  * [`ImmutableDict`](@ref Base.ImmutableDict)
  * [`Iterators.Pairs`](@ref)

## 类似 Set 的集合

```@docs
Base.AbstractSet
Base.Set
Base.BitSet
Base.union
Base.union!
Base.intersect
Base.setdiff
Base.setdiff!
Base.symdiff
Base.symdiff!
Base.intersect!
Base.issubset
Base.:⊈
Base.:⊊
Base.issetequal
Base.isdisjoint
```

以下类型均完全实现了上述函数：

  * [`BitSet`](@ref)
  * [`Set`](@ref)

以下类型仅实现了部分上述函数：

  * [`Array`](@ref)

## 双端队列

```@docs
Base.push!
Base.pop!
Base.popat!
Base.pushfirst!
Base.popfirst!
Base.insert!
Base.deleteat!
Base.splice!
Base.resize!
Base.append!
Base.prepend!
```

以下类型均完全实现了上述函数：

  * `Vector` (a.k.a. 1-dimensional [`Array`](@ref))
  * `BitVector` (a.k.a. 1-dimensional [`BitArray`](@ref))

## 集合相关的实用工具

```@docs
Base.Pair
Iterators.Pairs
```
