import {
  useEffect,
  useRef,
  useState,
} from "react";

interface OTPModalProps {
  open: boolean;
  email: string;
  onVerify: (
    otp: string
  ) => void;
  onResend: () => void;
}

const OTPModal = ({
  open,
  email,
  onVerify,
  onResend,
}: OTPModalProps) => {
  const [otp, setOtp] =
  useState<string[]>(
    Array(6).fill("")
  );

const [timer,setTimer] = useState(60);

const inputRefs =
  useRef<
    (HTMLInputElement | null)[]
  >([]);

  useEffect(() => {
    if (!open) return;


    const interval =
      setInterval(() => {
        setTimer(
          (prev) =>
            prev > 0
              ? prev - 1
              : 0
        );
      }, 1000);

    return () =>
      clearInterval(interval);
  }, [open]);

  const handleChange = (
    value: string,
    index: number
  ) => {
    if (!/^\d?$/.test(value))
      return;

    const updatedOtp = [
      ...otp,
    ];

    updatedOtp[index] =
      value;

    setOtp(updatedOtp);

    if (
      value &&
      index < 5
    ) {
      inputRefs.current[
        index + 1
      ]?.focus();
    }
  };

  const verifyOtp = () => {
    const finalOtp =
      otp.join("");

    onVerify(finalOtp);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">

      <div className="bg-white w-[450px] rounded-3xl p-8">

        <h2 className="text-3xl font-bold mb-2">
          Verify Email
        </h2>

        <p className="text-gray-500 mb-8">
          OTP sent to {email}
        </p>

        <div className="flex justify-center gap-3">

          {otp.map(
            (
              digit,
              index
            ) => (
              <input
                key={index}
                ref={(el) => {
                  if (el)
                    inputRefs.current[
                      index
                    ] = el;
                }}
                value={digit}
                maxLength={1}
                onChange={(
                  e
                ) =>
                  handleChange(
                    e.target
                      .value,
                    index
                  )
                }
                className="w-12 h-14 border rounded-xl text-center text-xl font-bold"
              />
            )
          )}

        </div>

        <button
          onClick={
            verifyOtp
          }
          className="btn-primary w-full mt-8"
        >
          Verify OTP
        </button>

        <div className="text-center mt-5">

          {timer > 0 ? (
            <span className="text-gray-500">
              Resend OTP in{" "}
              {timer}s
            </span>
          ) : (
            <button
              onClick={
                onResend
              }
              className="font-semibold"
            >
              Resend OTP
            </button>
          )}

        </div>

      </div>

    </div>
  );
};

export default OTPModal;