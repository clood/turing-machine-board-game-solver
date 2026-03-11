import Incorrect from "@mui/icons-material/HorizontalRuleRounded";
import Correct from "@mui/icons-material/PanoramaFishEye";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Paper from "@mui/material/Paper";
import { useTheme } from "@mui/material/styles";
import ShapeIcon from "components/ShapeIcon";
import SingleCharLabel from "components/SingleCharLabel";
import { useAppDispatch } from "hooks/useAppDispatch";
import { useAppSelector } from "hooks/useAppSelector";
import { FC } from "react";
import { digitCodeActions } from "store/slices/digitCodeSlice";
import { evaluateDigit } from "../deductions"; // helper that runs the wasm solver

const DigitCode: FC = () => {
  const dispatch = useAppDispatch();
  const digitCode = useAppSelector((state) => state.digitCode);
  const state = useAppSelector((s) => s); // full root state for deductions
  const theme = useTheme();

  return (
    <Paper
      component="section"
      id="digit-code-section"
      sx={{ width: 320, margin: "auto" }}
    >
      <Box p={2}>
        <Grid container>
          {(["triangle", "square", "circle"] as Shape[]).map((shape) => (
            <Grid key={shape} item xs={4} sx={{ textAlign: "center" }}>
              <Box
                width={1}
                mb={1}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <ShapeIcon shape={shape as "triangle" | "square" | "circle"} />
              </Box>
              {([5, 4, 3, 2, 1] as Digit[]).map((digit) => (
                <Box key={digit} width={1} position="relative">
                  <IconButton
                    id={`digit-code__${shape}-${digit}-button`}
                    aria-label={`${shape} ${digit}`}
                    color="primary"
                    sx={{
                      height: theme.spacing(6),
                      width: theme.spacing(6),
                    }}
                    onClick={async () => {
                      const entry = digitCode.find(
                        (e) => e.shape === shape && e.digit === digit
                      );

                      if (entry) {
                        // previously marked; clicking again clears the annotation
                        dispatch(
                          digitCodeActions.removeDigit({ shape, digit })
                        );
                        return;
                      }

                      // compute deduction from solver using the redux state
                      const { possible, certain } = await evaluateDigit(
                        state,
                        shape,
                        digit
                      );

                      if (!possible) {
                        dispatch(
                          digitCodeActions.setDigitState({
                            shape,
                            digit,
                            state: "incorrect",
                          })
                        );
                      } else if (certain) {
                        dispatch(
                          digitCodeActions.setDigitState({
                            shape,
                            digit,
                            state: "correct",
                          })
                        );
                      }
                    }}
                  >
                    <SingleCharLabel>{digit}</SingleCharLabel>
                    <Box
                      position="absolute"
                      top={4}
                      left={4}
                      sx={{ color: theme.palette.text.primary }}
                    >
                      {digitCode.find(
                        (entry) =>
                          entry.shape === shape && entry.digit === digit
                      )?.state === "correct" && <Correct fontSize="large" />}
                      {digitCode.find(
                        (entry) =>
                          entry.shape === shape && entry.digit === digit
                      )?.state === "incorrect" && (
                        <Incorrect
                          fontSize="large"
                          sx={{ transform: "rotate(-45deg)" }}
                        />
                      )}
                    </Box>
                  </IconButton>
                </Box>
              ))}
            </Grid>
          ))}
        </Grid>
      </Box>
    </Paper>
  );
};

export default DigitCode;
