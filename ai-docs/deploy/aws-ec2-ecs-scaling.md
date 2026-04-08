# AWS: EC2 scaling (vertical vs horizontal) and ECS

Conceptual guide for scaling Jiu Tracker–style workloads on AWS: one bigger machine vs many machines, and how **ECS** compares.

## Terms

| Term | Meaning |
|------|--------|
| **Vertical scaling** | One instance gets **more** CPU, memory, or disk performance (bigger instance type, tuned EBS). |
| **Horizontal scaling** | **More** instances (or containers) running the same app; traffic is spread across them. |

## EC2: vertical scaling

To make a **single** EC2 instance more powerful:

1. **Instance type** — In the EC2 console: stop the instance (if required for that type), **Actions → Instance settings → Change instance type**, pick a larger size (e.g. `t3.small` → `t3.xlarge`, or a memory-optimized family if RAM-bound).
2. **Storage** — If the bottleneck is disk: grow **EBS** volume size, use **gp3**, or raise **IOPS / throughput** as needed.

**Caveats:** Stopping an instance affects **instance store** (ephemeral) data; **Elastic IP** usually stays attached if not released. Larger types cost more—check pricing / Cost Explorer.

## EC2: horizontal scaling (2+ instances at once)

You **can** run multiple EC2 instances in parallel. That adds **aggregate** capacity and can improve availability if one instance fails.

Running “more servers” is not enough by itself. You typically need:

1. **Load balancer** — An **Application Load Balancer (ALB)** or **Network Load Balancer (NLB)** in front so traffic is distributed to healthy instances.
2. **Same deployment** — Same AMI / deploy process so every instance runs the same application version.
3. **Shared or external state** — Sessions, uploads, caches should not live only on one machine’s local disk. Use **S3**, **EFS**, **RDS**, **ElastiCache**, etc., depending on the workload.
4. **Health checks** — Target group health checks so unhealthy instances are removed from rotation.
5. **Optional: Auto Scaling** — An **Auto Scaling group** can replace failed instances and scale instance **count** by load or schedule.

**Summary:** Vertical = bigger box. Horizontal = more boxes + **LB + shared state + health checks** (and often ASG).

## ECS: do you need “the same thing”?

**Architecturally, yes.** You still want:

- Something **in front** of multiple replicas (**ALB** → ECS **service** is the common pattern for HTTP APIs).
- **Shared state** externalized (DB, object storage, cache)—same as multi-EC2.
- Multiple **tasks** serving the same container image.

**Operationally, it’s different.** With ECS you usually scale **tasks** (replicas) via **service desired count** and **auto scaling policies**, not by manually launching “another EC2” the same way.

| | Raw EC2 | ECS |
|---|--------|-----|
| Unit of scale | Instances you manage | **Tasks** (containers) scheduled by ECS |
| Capacity | You pick instance types / counts | **Fargate:** CPU/memory per task, no EC2 to manage. **EC2 launch type:** cluster of EC2 instances, ECS places tasks on them |
| Load balancing | You wire ALB + targets | ECS **service** + **target group** + **ALB** is standard |
| Patching / hosts | You patch AMIs / instances | **Fargate:** AWS manages infrastructure. **EC2 launch type:** you still maintain **container instances** |

**Short answer:** Same **ideas** (replicas behind a load balancer, state in managed services). Different **mechanics** (ECS services, task count, optional Fargate vs EC2 capacity).

## Related docs in this repo

- [EC2: Nginx reverse proxy + HTTPS](./ec2-nginx-https.md) — TLS and routing to the API on a single host.

## Changelog

| Date | Change |
|------|--------|
| 2026-04-05 | Initial document: EC2 vertical/horizontal scaling and ECS comparison. |
