react:
cache 客户端缓存

nextjs:

```jsx
主题：
    import { ThemeProvider } from "next-themes";
    import { useTheme } from "next-themes";
    const { theme, setTheme } = useTheme(); //使用切换主题的hooks
服务端缓存:
unstable_cache()
cookies:
import { cookies } from "next/headers";
(await cookies()).get(lucia.sessionCookieName)?.value ?? null;  //get方法获取对应名字cookie
(await cookies()).set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );      //set方法 设置cookie
```



正则表达式：

### :alnum: // 字母和数字



## prisma:

```jsx
prisma.$queryRaw`select * from xxx` //直接使用sql 查询

where:{
    not:{},
    select:{},
    include:{}
    take:10,
    cursor:{},
    skip:10,
    orderBy:{},
    distinct:{},
}

await prisma.$transaction(async (tx) => {
      await tx.user.create({
        data: {
          id: userId,
          username,
          displayName: username,
          email,
          passwordHash,
        },
      });
    });
```

## lucia

```jsx
const adapter = new PrismaAdapter(prisma.session, prisma.user);     //设置适配器,适配session和user的表结构
export const lucia = new Lucia(adapter, {                   //新建lucia实例
  sessionCookie: {
    // 设置过期时间为不过期
    expires: false,
    attributes: {
      // secure字段用于指定cookies只能通过 https 来发送
      secure: process.env.NODE_ENV === "production",
    },
  },
  //调用数据 lucia内部会自动调用
  getUserAttributes(databaseUserAttributes) {
    return {
      id: databaseUserAttributes.id,
      username: databaseUserAttributes.username,
      displayName: databaseUserAttributes.displayName,
      avatarUrl: databaseUserAttributes.avatarUrl,
      googleId: databaseUserAttributes.googleId,
    };
  },
});

const result = await lucia.validateSession(sessionId);  //validateSession 验证session
lucia.createSessionCookie(result.session.id);   //createSessionCookie 创建cookie
const sessionCookie = lucia.createBlankSessionCookie();     //createBlankSessionCookie 创建空的cookie
```

## react-query:

```jsx
//创建queryProvider组件
// 使用react-query的Provider,提供缓存和请求
const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [client] = useState(new QueryClient()); 

  return (
    <QueryClientProvider client={client}>
      {children}

  {/* 开发环境开启，右下角会有个开发工具 */}
  <ReactQueryDevtools initialIsOpen={false}></ReactQueryDevtools>
</QueryClientProvider>

  );
  return <div></div>;
};
export default ReactQueryProvider;  

useQuery(): //执行发起请求
const query = useQuery({
    queryKey: ["follower-info", userId],        //缓存的tag标签
    queryFn: () => kyInstance.get(`/users/${userId}/followers`).json(),
    initialData: initialState,	//初始数据，没获取到数据之前使用初始数据
    staleTime: Infinity,		//设置数据的新鲜时间，这里是无限
  });


useQueryClient()        //获取缓存信息
    queryClient.cancelQueries({ queryKey }); //暂停请求
    queryClient.getQueryData(queryKey);         //根据queryKey获取信息
    queryClient.setQueryData(queryKey, () => ({}));   //根据querykey设置缓存信息

useMutation()       //执行突变，删除 添加数据等操作
示例：
const { mutate } = useMutation({
    //突变函数
    mutationFn: () =>
      //关注了则是删除关注，没关注则是添加关注
      data.isFollowedByUser
        ? kyInstance.delete(`/api/users/${userId}/followers`)
        : kyInstance.post(`/api/users/${userId}/followers`),
    //这里使用onMutate，在请求发送前，先取消之前的查询，并获取之前的数据
    // 实现乐观更新的效果
    onMutate: async () => {
      // 作用：确保在 mutation 期间，任何与 queryKey 相关的查询操作都被暂停。
      // 目的：防止并发查询或更新与本次 mutation 冲突，从而避免数据不一致。
      //这个函数是取消正在进行的查询 而非删除查询
      await queryClient.cancelQueries({ queryKey });

  //获取旧的数据 用于回滚
  const previousState = queryClient.getQueryData<FollowerInfo>(queryKey);

  //更新queryKey的缓存信息
  //这里返回了一个新的对象，所以跟旧的对象不关联了，所以更改新对象不会影响到旧的对象，因此旧数据不会因为该操作而被更改
    //乐观更新信息
  queryClient.setQueryData<FollowerInfo>(queryKey, () => ({
    followers:
      (previousState?.followers || 0) +
      (previousState?.isFollowedByUser ? -1 : 1),
    isFollowedByUser: !previousState?.isFollowedByUser,
  }));
  console.log(previousState, "previousState");

  //返回旧数据
  return { previousState };
},
//            当更新失败时   回滚数据，这里的context是在onMutate中返回的
onError(error, variables, context) {
  //                          回滚数据
  queryClient.setQueryData(queryKey, context?.previousState);
  console.error(error);
  toast({
    variant: "destructive",
    description: "Something went wrong. Please try again.",
  });
},

  });

//useMutation 返回值中包含 mutate  mutateAsync  isPending  isSuccess  isError  error 数据信息
```



## ky 简化请求信息

```jsx
src/lib/ky.ts:
import ky from "ky";

//这里实现了一个对返回数据进行增强的函数
//把返回的createAt 和updateAt 字段转为了Date日期
const kyInstance = ky.create({
  parseJson: (text) => {
    return JSON.parse(text, (key, value) => {
      if (key.endsWith("At")) return new Date(value);
      return value;
    });
  },
});

export default kyInstance;

//直接使用：
kyInstance.get("/api/posts/for-you").json<PostData[]>,
    
//当然了也可以不对数据进行处理，直接使用，如下：
    const fetchData = async () => {
  const data = await ky.get('https://api.example.com/data', {
    retry: {
      limit: 3, // 最多重试 3 次
      methods: ['get'], // 仅对 GET 请求重试
    }
  }).json();    //.json()为获取数据
  console.log(datEa);
};
```



zod:

```jsx
import { z } from "zod";

const requiredString = z.string().trim().min(1, "Required");

export const signUpSchema = z.object({
  email: requiredString.email("非法的邮箱"),
  username: requiredString.regex(
    /^[a-zA-Z0-9_-]+$/,
    "仅允许字母、数字、下划线和连字符"
  ),
  password: requiredString.min(8, "最少八个字符"),
});

// 使用类型推导工具，根据zod schema 自动推断出对象的类型
export type SignUpValues = z.infer<typeof signUpSchema>;

//使用：
const { username, password } = loginSchema.parse(credentials);
```


