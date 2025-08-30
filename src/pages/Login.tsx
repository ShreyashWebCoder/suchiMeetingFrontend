import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URLS } from "@/services/api";

// Validation schemas
const adminSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const userSchema = z.object({
  prant: z.string().min(1, "Please select a Prant"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const vividhksetraSchema = z.object({
  sanghatan: z.string().min(1, "Please select a Sanghatan"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

// Auth service
const loginService = async (payload: any) => {
  const res = await axios.post(API_URLS.LOGIN, payload);
  return res.data;
};

const fetchPrants = async () => {
  const res = await axios.get(API_URLS.PRANTS);
  return res.data;
};

const fetchSanghatans = async () => {
  const res = await axios.get(API_URLS.SANGHATAN);
  return res.data;
};

const ADMIN_ROLE_ID = "6842c3184919f039da177f86";
const USER_ROLE_ID = "6842c3184919f039da177f87";
const VIVIDH_ROLE_ID = "6842c3184919f039da177f88";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const [prants, setPrants] = useState<{ value: string; label: string }[]>([]);
  const [sanghatans, setSanghatans] = useState<
    { value: string; label: string }[]
  >([]);

  useEffect(() => {
    fetchPrants().then((data) =>
      setPrants(data.map((p: any) => ({ value: p._id, label: p.name })))
    );
    fetchSanghatans().then((data) =>
      setSanghatans(data.map((s: any) => ({ value: s._id, label: s.name })))
    );
  }, []);

  const adminForm = useForm({
    resolver: zodResolver(adminSchema),
    defaultValues: { userId: "", password: "" },
  });

  const userForm = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: { prant: "", password: "" },
  });

  const vividhksetraForm = useForm({
    resolver: zodResolver(vividhksetraSchema),
    defaultValues: { sanghatan: "", password: "" },
  });

  const handleAdminLogin = async (data: z.infer<typeof adminSchema>) => {
    setIsLoading(true);
    try {
      const payload = {
        userId: data.userId,
        password: data.password,
        role_id: ADMIN_ROLE_ID,
      };
      const res = await loginService(payload);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", "admin");
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("roleId", res.user.role_id);
        toast({ title: "Login Successful", description: "Welcome Admin!" });
        navigate("/admin-dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUserLogin = async (data: z.infer<typeof userSchema>) => {
    setIsLoading(true);
    try {
      const selectedPrant = prants.find((p) => p.value === data.prant);
      const payload = {
        prant_id: data.prant,
        password: data.password,
        role_id: USER_ROLE_ID,
      };
      const res = await loginService(payload);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", "user");
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("prantId", data.prant);
        console.log(data.prant);
        localStorage.setItem("prantName", selectedPrant?.label || "");
        localStorage.setItem("roleId", res.user.role_id);
        toast({ title: "Login Successful", description: "Welcome User!" });
        navigate("/user-dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleVividhksetraLogin = async (
    data: z.infer<typeof vividhksetraSchema>
  ) => {
    setIsLoading(true);
    try {
      const selectedSanghatan = sanghatans.find(
        (s) => s.value === data.sanghatan
      );
      const payload = {
        sanghatan_id: data.sanghatan,
        password: data.password,
        role_id: VIVIDH_ROLE_ID,
      };
      const res = await loginService(payload);

      if (res.token) {
        localStorage.setItem("token", res.token);
        localStorage.setItem("userType", "vividhksetra");
        localStorage.setItem("sanghatanId", data.sanghatan);
        localStorage.setItem("sanghatanName", selectedSanghatan?.label || "");
        localStorage.setItem("userId", res.user.id);
        localStorage.setItem("roleId", res.user.role_id);
        toast({
          title: "Login Successful",
          description: "Welcome Vividhksetra User!",
        });
        navigate("/vividhksetra-dashboard");
      } else {
        toast({
          title: "Login Failed",
          description: "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4"></div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            अपेक्षित सूची
          </h1>
          {/* <p className="text-gray-600">राष्ट्रीय स्वयंसेवक संघ</p> */}
        </div>

        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-center">Login</CardTitle>
            <CardDescription className="text-center">
              Select your user type and login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="admin" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="admin">Admin</TabsTrigger>
                <TabsTrigger value="user">User</TabsTrigger>
                <TabsTrigger value="vividhksetra">Vividh</TabsTrigger>
              </TabsList>

              {/* Admin Tab */}
              <TabsContent value="admin" className="space-y-4">
                <Form {...adminForm}>
                  <form
                    onSubmit={adminForm.handleSubmit(handleAdminLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={adminForm.control}
                      name="userId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>User ID</FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Enter your user ID"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={adminForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Admin"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* User Tab */}
              <TabsContent value="user" className="space-y-4">
                <Form {...userForm}>
                  <form
                    onSubmit={userForm.handleSubmit(handleUserLogin)}
                    className="space-y-4"
                  >
                    <FormField
                      control={userForm.control}
                      name="prant"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Prant</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your Prant" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {prants.map((prant) => (
                                <SelectItem
                                  key={prant.value}
                                  value={prant.value}
                                >
                                  {prant.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={userForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as User"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>

              {/* Vividh Tab */}
              <TabsContent value="vividhksetra" className="space-y-4">
                <Form {...vividhksetraForm}>
                  <form
                    onSubmit={vividhksetraForm.handleSubmit(
                      handleVividhksetraLogin
                    )}
                    className="space-y-4"
                  >
                    <FormField
                      control={vividhksetraForm.control}
                      name="sanghatan"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Sanghatan</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your Sanghatan" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {sanghatans.map((s) => (
                                <SelectItem key={s.value} value={s.value}>
                                  {s.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={vividhksetraForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input type="password" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      className="w-full bg-orange-600 hover:bg-orange-700"
                      disabled={isLoading}
                    >
                      {isLoading ? "Logging in..." : "Login as Vividhksetra"}
                    </Button>
                  </form>
                </Form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
