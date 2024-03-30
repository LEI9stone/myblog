---
title: 组件通讯实战——Form表单验证
date: 2020-04-02
categories:
tags:
  - vue
---

![实战——Form表单.png](https://cdn.jsdelivr.net/gh/AsherSun/image-host/blog-img/02_form.png)

## 组件行为定义

前端的mv*框架开发最重要的是什么？组件化。开发一个组件，首先要定义好这个组件的行为是什么。通俗来讲，这个组件是负责做什么的？

**组件行为可以由以下几个方面来定义**

- 基本组件
- 业务组件
- 页面中的组件划分

<!-- more -->

### 基本组件

复用性极高的组件，一般这些组件都由优秀的第三方组件库提供。一个项目开发，如果为了效率都会采用一个第三方组件库。当然团队内部也可以开发一个组件库，一般小团队内部开发基础组件库会选择某一个第三方组件库来扩展。

### 业务组件

适合项目业务场景的复用性组件，当项目中有某一个场景会有多处应用到。但是该场景又需要依赖项目的业务逻辑。所以通常会把这类场景设计为一个业务组件

### 页面中的组件划分

我们的一个页面会由基础组件 + 业务组件组成。但是有些 UI 是页面独有的。所以会把页面中复杂的HTML结构划分出一个个组件。这些组件可以由 UI 稿上的视觉来划分也可以由某一个行为来划分

## 接口定义

组件的接口是由组件的行为来定义的。因为知道组件的行为，所以我们才知道这个组件的输出是什么。既然知道输出那么就可以推导出组件的输入是什么

**输入**

> 接口接收的数据，会根据输出来决定输入的是什么数据

**输出**

> 组件的行为结果，输入会影响到输出的内容不同

## 表单组件

根据上面的概念，我们可以来定义一下组件的基本行为

**行为**

负责用户输入数据的验证

**根据行为来划分组件**

- 输入行为: 负责处理用户的输入，比如input、checkbox等
- 验证行为: 负责验证用户输入的数据
- 表单域: 负责组织用户的各种输入行为

### 表单的输入行为组件

> 输出结果：接收用户输入数据并展示给用户看
>
> 输入数据：表单控件的各种属性、用户上一次输入的内容

根据上面的输入、输出，表单的输入行为组件结构为：

::: details 点击查看html结构：

```html
<template>
  <div>
    <input v-bind="$attrs" :value="value" @input="handleInput">
  </div>
</template>
```



:::

::: details 点击查看script

```javascript
import { Vue, Component, Prop, Watch } from 'vue-property-decorator';
@Component({
  name: 'WInput',
})
export default class WInput extends Vue {
  @Prop({default: ''}) private readonly value!: string;
}
```



:::

### 验证行为组件

> 输出结果：对数据进行校验
>
> 输入数据：要校验的数据、校验规则



::: details 点击查看html结构

```html
<template>
  <div>
    {{label}}
    <slot></slot>
    <p v-if="errMessage" style="color: red">{{errMessage}}</p>
  </div>
</template>
```



:::



::: details 点击查看script

```javascript
import { Vue, Component, Prop, Inject } from 'vue-property-decorator';
import { Model, Rules } from './interface';
@Component({
  name: 'WFormItem',
})
export default class WFormItem extends Vue {
  public errMessage: string = '';
  @Prop() private readonly label!: string;
  @Prop() private readonly prop!: string;
  @Inject() private readonly validateRules!: Rules;
  @Inject() private readonly modelData!: Model;
}
```



:::



### 表单域组件

> 输出：最终的提交校验、组织用户输入行为
>
> 输入：各种用户输入数据、各种输入数据对应的校验规则

**html结构：**

```html
<template>
  <form :autocomplete="autocomplete">
    <slot></slot>
  </form>
</template>
```

**script：**

```javascript
import { Vue, Component, Prop, Provide } from 'vue-property-decorator';
import { Model, Rules } from './interface';
import { VNode } from 'vue';

@Component({
  name: 'WForm',
})
export default class WForm extends Vue {
  @Prop({ default: 'off' }) private readonly autocomplete!: string;
  @Prop({ default: () => ({}) }) private readonly model!: Model;
  @Prop({ default: () => ({})}) private readonly rules!: Rules;
  @Provide() private modelData: Model = this.model;
  @Provide() private validateRules: Rules = this.rules;
  @Provide() private testResponseData: any = this;
}
```

表单组件的设计已基本完成，先不急着做数据校验，先了解几个开发技巧

## 数据双向通讯

### v-model语法糖的实现

v-model 在vue中做数据通讯是最基本的, 用法这里就不做过多阐述。说一下v-model语法糖的内部实现

#### 输入

v-model 接收数据的行为定义为输入。那么vue中对一个组件的基本输入方式是通过 `v-bind:prop="data"`

> `prop` 是定义要接受数据的 prop name
>
> `data` 是传递过去的数据


v-model 的 prop name 是 value。所以最终vue会把v-model的输入解析为 v-bind:value="data"

#### 输出

v-model 会把经过子组件作用域处理过的数据传递到父组件作用域，而传递的过程是通过vue的事件机制传递的

**回忆下vue的事件**

```javascript
this.$emit(eventName, data)
this.$on(eventName, callback)
```

v-model 输出的事件为是 `this.$emit('input', data)`

#### 结论

通过对上面的输入、输出的理解。v-model 在一个组件上的使用可以结构为这样：

```html
<template>
	<com :value="data" @input="handleInput"></com>
<template>
```

**提问**

- v-model 的事件定义只能是 input 吗？
- v-model 的prop name 名只能是value 吗？

这个问题的答案：不是，具体可以看下 vue 的官方文档，如何使用文档上已经说明了，这里不做任何赘述。

### .sync语法糖的实现

.sync 语法糖的实现思路和上面基本一致，只是使用语法上的不同。所以基础概念就不做过多冗余介绍

**.sync的语法**

```html
<text-document v-bind:title.sync="doc.title"></text-document>
```

#### 输入

输入还是通过v-bind:propName="data" 与v-model一致

#### 输出

输出还是通过事件输出，只是有一点区别。

**先看下输出语法**

```javascript
this.$emit('update:propName', newTitle)
```

通过语法我们可以看到区别。eventName的 `update`是必须的，`update`后面跟随的是 propName. 也就是 v-bind 绑定的 接口名称。

#### 结论

- v-model 与 .sync 都可以实现数据双向通讯。但它们的通讯只是父子通讯，而非跨层级通讯。跨层级通讯在上一节有说过。
- v-model 与 .sync 的区别有语法使用上的区别，还有就是 v-model 可以直接用到表单DOM元素上。而 .sync 是在vue的组件上使用

## From表单验证通讯选择

在上面的组件划分。我们把表单验证划分为三个组件，而这三个组件都有相互关联的关系。

**关联关系有以下几个场景：**

1. 如果验证组件需要实时验证输入组件的输入信息
1. 表单域控件需要知道验证组件的验证结果

### dispatch通讯

dispatch 通讯场景为跨层级通讯。为什么说form表单验证非常适用dispatch通讯呢？其实主要解决的也就是form 表单验证的跨层级通讯。请看下面的代码：

```html
<w-form :model="formData" :rules="validateRules" ref="form" @chage-data="changeData"  :responseDataProp="changeResponseData">
  <w-form-item label="用户名称" prop="name">
    <template v-slot:default>
      <w-input v-model="formData.name"></w-input>
    </template>
  </w-form-item>
</w-form>
```

上面组件结构也可以不选择dsipatch通讯方式，自然是没有什么问题的。但如果是这样的呢？

```html
<w-form :model="formData" :rules="validateRules" ref="form" @chage-data="changeData"  :responseDataProp="changeResponseData">
  <w-form-item label="用户名称" prop="name">
    <template v-slot:default>
    	<w-comp>
    	  <w-input v-model="formData.name"></w-input>
    	</w-comp>
    </template>
</w-form>
```

可以明显看到，w-input 组件的父组件并不是 w-form-item了。如果不使用跨层级通讯方案，而选择了父子组件通讯。那么这样的form 表单验证组件通用性会大打折扣。

对于组件来说，并不知道使用者会给“我”套多少层父组件。为了解决这种不确定性并且为了复用性，我们会选择跨组件通讯。至于跨组件通讯的方案有多种，使用哪种都可以。但是，有一句话：适合我的才是最好的

### 独立组件中规避使用$parent、$children的原由。

- 不通用性
- 强绑定关系，既然是强绑定那么就说明组件与组件之间的耦合非常高了。
- 怕使用上瘾😂，refs、parent、children使用一时爽，一直使用一直爽😂

## 跨层级传递数据

使用过react的同学都知道react一个高级特性 —— 上下文，而Vue在2.2.0之后也新增了这个特性

### inject

基本语法使用，这里不做过多赘述。如果有没有用过的请自行文档

### provide

基本语法使用这里就不做过多赘述。不过文档中有一句话，我至今还是半懂半不懂

> 提示：provide 和 inject 绑定并不是可响应的。这是刻意为之的。然而，如果你传入了一个可监听的对象，那么其对象的属性还是可响应的。


这句话中的可监听对象，我看文档的时候没有理解。然后动手验证了下, 得到的结果为：

- 如果把一个组件的实例通过provide传递下去，手动修改这个实例中的属性的值，inject 并不会响应
- 由上述结论，我在实例中设置了js中的基本数据类型和引用数据类型，分别通过provide传递下去，手动修改，inject 也不会响应
- 如果把实例中的prop 通过 provide 传递下去，在使用了inject的组件中，数据响应了😂。

#### 结论

这里的可监听对象至少清楚了是prop选项中任意属性。而不可监听对象是组件的实例。至于还没有其他可监听对象，我没有做过多测试

## 数据验证

表单验证组件，其目的还是数据验证。这里推荐数据验证的第三方库：async-validator。具体使用请自行npm 网站或者 github 网站

### async-validator基本介绍

从名字可以看出来，这是一个异步验证库。那么在form表单验证中，当用户点击提交按钮的时候，我们是不是可以通过 promise.all 的方法来统一验证各种输入数据。

大多数优秀的第三方组件库都有在用 async-validator 第三方验证库

## 最后

### 勘误

以上介绍了开发一个组件的基本套路和第三方组件库中form表单验证的实现原理，文中如有错误请指出，谢谢🙏。在介绍组件设计的基本思路时，大多数都是我的个人理解和开发经验。并不敢说全部都对，欢迎各位大佬来交流经验，思想碰撞。

### 后续

这是vue基础——组件通讯第一篇实战文章，后续还会有各种场景下的实战，敬请期待。不过后续的实战内容可能要延期.... 大概会延期很长的时间，因为我之后的计划是看下vue-router的源码，把自己的理解做一个总结。