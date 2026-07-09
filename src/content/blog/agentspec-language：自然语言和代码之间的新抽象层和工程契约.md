---
title: AgentSpec Language：自然语言和代码之间的新抽象层和工程契约
slug: agentspec-language
description: AI agent 时代，自然语言意图和底层代码之间，缺少一个稳定、可追踪、可验证、可同步的中间层。
pubDate: 2026-06-26
legacySlugs:
  - agentspec-language自然语言和代码之间的新抽象层和工程契约
tags:
  - AI Agent
  - SDD
draft: false
---

Coding Agent 越来越会写代码以后，我觉得真正值得讨论的问题，不是代码会不会消失，也不是程序员还要不要学 Python、TypeScript 或 Rust。

更重要的问题是：

**自然语言和传统高级编程语言之间，会不会出现一个新的 agent-native 抽象语言层？**

我的判断是，会。我暂时把它叫做 **AgentSpec Language**。

它不是 SDD 的新包装，也不是一份更详细的需求文档。它更像一种新的中间语言：人类用它表达意图、约束和边界，agent 用它规划任务、选择技术栈、调用工具、生成代码，并验证结果。

# 一、为什么需要这个语言层

自然语言很强，但太松。一句“做一个安全的 CRM 后台”，人类大概能理解，但 agent 如果直接拿它去生成系统，就有太多地方需要猜。

安全是 RBAC？字段脱敏？导出审计？多租户隔离？还是接口鉴权？

传统高级编程语言很精确，但又太接近实现层。Python、TypeScript、Rust、SQL 这些语言可以准确表达实现，但它们要求人类直接进入函数、类型、接口、数据库、状态管理、部署配置这些细节。

所以中间需要一个新层级：

```plain
自然语言 / 业务想法
        ↓
AgentSpec Language
        ↓
Python / TypeScript / Rust / SQL / Shell
        ↓
数据库 / 操作系统 / 网络 / 文件系统

```

这个层级高于传统高级编程语言，因为它表达的是目标、约束、权限、工具、架构选择和验证标准。它又低于自然语言，因为它必须结构化、可执行、可检查、可复现。

# 二、为什么它应该叫 Language

这里的 language，不是指它要变成另一门 Python 或 Rust。它不应该追求图灵完备，也不应该让人类去写大量复杂逻辑。那样只会变成另一种 DSL 负担。

但它仍然应该是一种 language。

因为它需要有稳定的表达单位。比如：

目标是什么。

上下文是什么。

有哪些约束。

agent 可以用哪些工具。

哪些动作需要人工确认。

技术栈如何选择。

任务如何拆解。

结果如何验证。

执行过程如何追踪。

这些东西如果只是自然语言，就是 prompt。如果它们有明确结构、语义、运行环境和验证机制，就已经不是普通文档，而是一种面向 agent 的规范语言。

所以我理解的 AgentSpec Language 不是通用编程语言，而是：

**一种位于自然语言和传统代码之间的 agent-native specification language。**

# 三、它和 SDD 不一样

这一点很容易被误解。SDD 关注的是一种开发流程：先写 spec，再根据 spec 开发代码。但 AgentSpec Language 关注的不是流程，而是媒介。

它要回答的是：自然语言意图如何被转换成 agent 可以执行的中间表示。

SDD 里的 spec 通常主要给人看。AgentSpec Language 必须同时给人和 agent 看。

人需要理解它表达了什么意图。

agent 需要根据它规划、调用工具、生成代码、跑测试、更新实现。

runtime 需要根据它检查权限、记录轨迹、发现 drift。

所以它不是“写文档驱动开发”。它更接近：

```plain
自然语言对话
        ↓
AgentSpec Language
        ↓
Agent runtime / coding agent
        ↓
代码、测试、部署、运行轨迹

```

这才是它和传统 SDD 最大的区别。

# 四、它不重新实现底层语言

AgentSpec Language 不应该把所有业务逻辑都写进自己的一套语法里。

比如有一条规则：只有当客户账户余额大于 0，且账户未被冻结时，销售阶段才能推进。

这条逻辑本身可以继续写在 TypeScript、Rust、SQL 或策略引擎里。AgentSpec Language 要表达的是：

这条约束存在。

它属于哪个业务目标。

它由哪个模块实现。

它需要哪些测试证明。

修改相关代码时，agent 必须知道它影响了这条约束。

也就是说，它描述的是 **what must hold**，不是重新实现 **how it works**。这样才能避免它掉进 DSL 陷阱。

它不是传统高级语言的替代品，而是传统高级语言之上的意图层。

# 五、对话是入口，不是最终形态

未来 agent 肯定会更会追问。用户说“我要一个安全的 CRM 后台”，agent 可以追问：你说的安全是 RBAC，还是字段脱敏，还是导出审计？

这很好。但多轮对话本身不是稳定的工程资产。聊天记录很难版本化，很难审查，也很难接入测试和 CI。

所以更合理的关系是：

```plain
多轮对话 → 生成 / 更新 AgentSpec Language 表达

```

对话负责澄清意图。AgentSpec Language 负责沉淀意图。

# 六、工程契约是它的落地能力

如果 AgentSpec Language 只是表达意图，而不能和代码、测试、运行轨迹产生关系，那它仍然只是漂亮文档。所以它必须具备工程契约能力。

最基础的形式可以是这样：

```plain
REQ-CRM-021：销售阶段推进必须经过账户状态校验

Intent:
- 账户余额必须大于 0
- 账户不能被冻结

Implementation:
- src/domain/sales/stagePolicy.ts#canAdvanceStage

Evidence:
- stagePolicy.test.ts
- salesStagePermission.integration.test.ts

Runtime Trace:
- audit_log.sales_stage_advance

```

底层代码也可以反向标记：

```plain
// @agentspec REQ-CRM-021
export function canAdvanceStage(customer: Customer): boolean {
  return customer.balance > 0 && customer.status !== "frozen";
}

```

这样，当代码被人类或 agent 修改时，系统可以知道：这次改动影响了哪条意图，哪些测试需要重新运行，AgentSpec 是否需要同步更新。

这不是 AgentSpec Language 的全部，但这是它能落地的关键。

# 七、结论

我现在最核心的观点是：

**自然语言和传统高级编程语言之间，会出现一个新的 agent-native 抽象语言层。**

它不是普通 prompt。 不是 Spec文档。 也不是另一门通用编程语言。 也不是让人手写的大量 YAML 。

它是一种给 AI agent 使用的意图编程层。自然语言负责提出问题。 AgentSpec Language 负责把问题变成可执行、可验证、可追踪的结构。 传统高级语言负责最终实现。 Agent runtime 负责执行、检查和同步。

代码不会消失。传统编程语言也不会消失。但人类创造软件的第一入口，可能会从“直接写代码”，逐渐变成“定义意图、边界、约束和验证方式”。这就是我认为 AgentSpec Language 真正值得讨论的地方。
