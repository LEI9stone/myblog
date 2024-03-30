---
title: IndexedDB踩坑指南
date: 2021-03-15
categories:
tags:
  - JavaScript
---

> IndexedDB 是一种底层 API，用于在客户端存储大量的结构化数据（也包括文件/二进制大型对象（blobs））



**什么场景下会使用？**

+ 异步调用的API 

+ localStorage的限制

+ 举一个最直观的🌰

  > **印鸽照片冲印业务**
  >
  > 之前遇到一个反馈问题: 用户上传几百张图片，会有图片丢失的问题。该问题造成的原因可能是localStorage存储的大小限制导致了数据丢失。
  >
  > 而indexedDB从目前的结论中来看，存储的容量是大于localStorage的，应该不低于250MB。甚至在某些浏览器中无上限



## 兼容性如何？

> 兼容性数据调查时间为**2020-9-29**



[canIuse?search=IndexedDB](https://caniuse.com/?search=IndexedDB)

![image-20201129184710130](/Users/ashersun/Library/Application Support/typora-user-images/image-20201129184710130.png "CanIUse=IndexedDb")



[ios devices version](https://developer.apple.com/support/app-store/)

![image-20201129185625615](/Users/ashersun/Library/Application Support/typora-user-images/image-20201129185625615.png)



1. 上图可以看到，indexdbDB 在主流浏览器中的支持还是挺不错的(IE除外)。在安卓上，可以说是100%支持(远古时代的机器除外)
2. 从图中可以看到在IOS中，10版本以下都会存在一些问题。再看下IOS目前系统的用户分布来看，有6%是未知版本系统，有可能是11、10。活着10以下

**兼容性总结:**

如果有项目中使用indexedDB操作，可以先统计下目前业务中ios系统版本的用户占比，看下ios10 以下的用户有多少，是否有必要出兼容方案等。



## API基本简介

> indexedDB 使用索引实现对数据的高性能搜索。它不是SQL(关系型数据库), 而是类似NoSQL。
>
> 其实前端接触比较多的还是NoSQL，比如小程序云开发的存储方案、MongoDB。



+ 打开数据库(`indexedDB.open(dbName, version)`) 返回 `IDRequest`
  + `idb.open`和`idb.deleteDatabase`都会返回`IDRequest`对象
  + `success`
  + `error`
  + `upgradeneeded`
  + ... 
+ 数据库删除(`indexedDB.deleteDatabase`)
  + `success`
  + `error`
  + 删除不存在的数据并不会报错
+ `indexedDB.cmp(keyPath, keyPath)`
  + 比较传入的`keyPath`是否为相同的主键。`0`相同，`1`第一个keyPath大于第二个, `2`第一个keyPath小于第二个
  + 不能用来比较任意JavaScript值，比如boolean、object。如果比较则报错
+ `IDBDatabase`
  + 在数据库`open`之后的`onsuccess`时间的`result`上拿到这个对象
  + 后面的`CRUD`操作是在这个对象上进行操作的
  + `name`字符串，数据库名称
  + `version`整数，第一次创建时，该属性的值为`null`
  + `objectStoreNames`, `DOMStringList`对象(字符串集合)，包含当前数据库的所有`object store`的名字
    + `idb.objectStoreNames.contains(storeName)`判断是否存在`object store`
  + `onabort` 事务中止的监听函数
  + `onclose` 数据库意外关闭的监听函数
  + `onerror`
  + `onversionchange`数据库版本变化时触发（发生`upgradeneeded`事件，或调用`indexedDB.deleteDatabase()`）
  + `close()`关闭数据库连接，实际会等所有事务完成后再关闭
  + `createObjectStore(storeName, options)`创建`object store`仓库，返回一个`IDBObjectStore`对象
    + 该方法只能在`versionchange`事件中调用
    + `options`为一个对象，包含`keyPath` 和`autoIncrement`
  + `deleteObjectStore()`删除指定的对象仓库
    + 只能在`versionchange`事件中调用
  + `transaction()`返回一个`IDBTransaction`事物对象
    + `IDBTransaction`对象下的`objectStore`返回一个`IDBObjectStore`对象
+ `IDBObjectStore`
  + `indexNames`返回一个类似数组的对象
  + `keyPath`返回当前对象仓库的主键
  + `name`当前对象仓库的名称
  + `autoIncrement`表示主键是否会自动递增
  + `transaction`返回当前对象仓库所属的事物对象
  + `add(value,key)`数据添加方法
  + `put(value,key)`更新方法
  + `clear()`删除当前对象仓库的所有记录，该方法不需要参数
  + `delete(key)`删除质地等主键的记录
  + `count(key)`返回计算记录的数量。不带参数是，该方法返回对象仓库记录的所有记录数量。如果主键或者`IDBKeyRequest`对象作为参数，则返回对应的记录数量。
+ 更多API简介请查看[网道](https://wangdoc.com/javascript/bom/indexeddb.html)







### 资源汇总

**以下网址请根据顺序阅读。如果有一定基础可以直接去看MDN文档或者去github中找indexedDB相关的开源仓库食用**

[阮一峰](http://www.ruanyifeng.com/blog/2018/07/indexeddb.html)、[网道](https://wangdoc.com/javascript/bom/indexeddb.html)、[MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)

**比较推荐的开源仓库**

 [localForage](https://localforage.github.io/localForage/)、[dexie.js](http://www.dexie.org/)、[PouchDB](https://pouchdb.com/)、[idb](https://www.npmjs.com/package/idb)、[idb-keyval](https://www.npmjs.com/package/idb-keyval)、[JsStore](https://jsstore.net/)、[lovefield](https://github.com/google/lovefield)





## 踩坑记录

+ `onupgradeneeded` 事件在较新的浏览器中有实现，需要测试哪些支持( Chrome 23+ 、Opera 17+ 以及 IE 10+ 支持)。
+ `IDBTransaction.READ_WRITE` 可以支持旧版本事物`readwrite`模式
+ 未指定事物模式(mode)时，默认为 `readonly` 模式
+ `versionchange` 事务中进行新建或删除对象仓库或索引
+ 事务三种模式: `readonly`、`readwrite`、`versionchange`
+ `autoIncrement` 开启键生成器. 默认不开启。
+ 只能在 `onupgradeneeded` 中修改数据库结构，比如: 创建/删除对象存储空间、构建和删除索引
+ 错误事件遵循冒泡机制。 如果不想对每个事务进行错误处理，可以在数据库对象这层处理(错误最终到达的地方)
+ 当前数据库不存在，或者版本升级会触发`onupgradeneeded`事件
+ 在`open` 操作的时候`onupgradeneeded`事件与`onsuccess`事件的触发顺序

  + 如果触发了`onupgradeneeded` 事件，那么会优先触发`onupgradeneeded`事件。之后在`onsuccess`
  + 无论是否走不走`onupgradeneeded`事件, 最终都会走`onsuccess`事件。而真正标志着`open`结束也是在`onsuccess`函数中进行通知。
  + 所以根据上述结论，如果在`open`之后进行`readwrite`操作，请一定要在`onsuccess`之后`readwrite`
+ 如何新增的时候，如何判断数据是否已经存在？

  + 解析错误信息，根据错误信息调用`put`方法
  + 判断主`key`的方式



## 小程序和小程序WebView

+ 小程序的存储是小程序官方提供的API，大小限制在10MB。在小程序中，目前没有类似IndexedDB的存储方案。
+ 需要测试在小程序webview中的支持情况





## 总结

+ IndexedDB可以存储大量的结构化数据(文件/二进制大型对象blobs)
+ IndexedDB是异步操作，使用索引进行高性能的数据搜索。对比`LocalStorage`和`SessionStorage`，有较好的性能优势
  + 其一：不会阻塞JS执行，而`LocalStorage`和`SessionStorage`都是同步操作
  + 其二：针对某条数据查找可以直接使用索引来查找。而`LocalStorage`和`SessionStorage`查找某条数据需要自行写`JS逻辑处理`
  + 其三: `Cookie`、`LocalStorage`、`SessionStorage`的存储大小限制较大。并且所存储的数据需要序列化为字符串，而`IndexedDB`不会
+ `WebSQL`与`IndexDB`
  + `WebSQL`兼容性太差，主流浏览器只有谷歌支持。`IndexedDB`兼容性方面现代主流浏览器都支持
  + `WebSQL`没有纳入web标准, 而`IndexedDB`是被纳入web标准的
  + `WebSQL`的存储是临时性的存储，比如浏览器刷新那么之前存储的数据会丢失(技术文章中看到的,具体没有验证。感兴趣的可以验证下)。而`IndexedDB`是持久化存储，用户不手动清除数据。那么数据则永远存在
+ `IndexedDB`是同源策略, 即同个域名下的网页可以访问该域名下的`IndexedDB`存储的数据。不同域名之间的`IndexedDB`数据不会访问
+ `transaction`(事务对象) 方法传入的数据库名称可以传入`string `或者` Arrary<string>`





## 已知问题待测试验证

+ IndexedeDB的第一次调用会询问用户是否可以使用？
+ [IndexedDB 在浏览器的隐私模式（Firefox 的 Private Browsing 模式和 Chrome 的 Incognito 模式）下是被完全禁止的。 隐私浏览的全部要点在于不留下任何足迹，所以在这种模式下打开数据库的尝试就失败了。](https://developer.mozilla.org/zh-CN/docs/Web/API/IndexedDB_API/Using_IndexedDB)
+ 作用域概念？ (`只是个人理解，未验证。可以当作参考: )`)
  + 目前的理解为：用事务打开的对象仓库为一个作用域.
    + 示例一：如果一个事务打开：a对象仓库和b对象仓库。那么a和b拥有同一个作用域，可以并行`readonly`，不能并行`readwrite`
    + 示例二：如果A事务打开打开a对象仓库，B事务打开b对象仓库。那么a单独拥有一个作用域，b也单独拥有一个作用。所以，是可以同时对a和b`readwrite`，但是不能对a同时进行多个`readwrite`。而`readonly`在任何情况下都可以并行。
+ `onversionchange`用法以及使用场景？
+ 



 

