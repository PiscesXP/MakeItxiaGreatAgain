import { ApiRequestResult, ApiRequestStateEnum } from "@/request/types";
import { ModalFuncProps } from "antd/es/modal";
import { Modal } from "antd";

export interface ModalParam {
  onSuccess?: ModalFuncProps | boolean;
  onFail?: ModalFuncProps | boolean;
  onError?: ModalFuncProps | boolean;
}

interface PopModalOnResultParam extends ModalParam {
  result: ApiRequestResult;
}

interface PopModalOnRequestParam extends ModalParam {
  request: Promise<ApiRequestResult>;
}

interface ModalFuncReturn {
  destroy: () => void;
  update: (newConfig: ModalFuncProps) => void;
}

function popModalOnApiResult({
  result,
  onSuccess,
  onFail,
  onError,
}: PopModalOnResultParam): ModalFuncReturn | null {
  const props: ModalFuncProps = { centered: true };
  const { data } = result;
  switch (result.state) {
    case ApiRequestStateEnum.error:
      if (onError) {
        Object.assign<ModalFuncProps, ModalFuncProps>(props, {
          title: "请求错误",
          content: result.error ? result.error.toString() : "未知错误",
        });
        if (typeof onError !== "boolean") {
          Object.assign<ModalFuncProps, ModalFuncProps>(props, onError);
        }
        return Modal.error(props);
      }
      break;
    case ApiRequestStateEnum.fail:
      if (onFail) {
        Object.assign<ModalFuncProps, ModalFuncProps>(props, {
          title: "请求失败",
          content: `[${data?.code}]: ${data?.message}`,
        });
        if (typeof onFail !== "boolean") {
          Object.assign<ModalFuncProps, ModalFuncProps>(props, onFail);
        }
        return Modal.error(props);
      }
      break;
    case ApiRequestStateEnum.success:
      if (onSuccess) {
        Object.assign<ModalFuncProps, ModalFuncProps>(props, {
          title: "操作成功",
        });
        if (typeof onSuccess !== "boolean") {
          Object.assign<ModalFuncProps, ModalFuncProps>(props, onSuccess);
        }
        return Modal.success(props);
      }
      break;
  }
  return null;
}

function popModalOnAsyncApiRequest({
  request,
  ...rest
}: PopModalOnRequestParam): Promise<ApiRequestResult> {
  request.then((result) => {
    popModalOnApiResult({ result, ...rest });
  });
  return request;
}

export { popModalOnApiResult, popModalOnAsyncApiRequest };
